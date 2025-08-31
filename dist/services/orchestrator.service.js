import { v4 as uuidv4 } from 'uuid';
import { SIMILARITY_THRESHOLD } from "../constants/threshold.js";
import { cosineSimilarity, embdText } from "../utils/embedding.js";
import { findPromptsByTags } from "../utils/findPromptsByTags.js";
import { uploadImageFromUrl } from "./aws-s3.service.js";
import { generateImageWithDallE, parseMessageWithGPT } from "./openAi.service.js";
import { createPromptAndImage } from "../utils/createPromptAndImage.js";
import { getCachedImages } from '../utils/cachedImages.js';
import { createTwilioMessage } from './twillio-client.service.js';
export async function findOrCreateImage(message, userId, phone) {
    const intent = await parseMessageWithGPT(message);
    console.log("message: ", message);
    console.log("intent: ", intent);
    if (intent.needs_clarification) {
        console.log("the prompt needs more clarification to generate a image!!");
        await createTwilioMessage(phone, `${intent.clarification_question} and write the message all over again` || "Could you please provide more details?");
        return;
    }
    const requestEmbedding = await embdText(message);
    if (!requestEmbedding) {
        console.error("Orchestrator :: could not embed text");
        await createTwilioMessage(phone, "Failed to process request.");
        return;
    }
    const tags = [intent.cache_lookup.business_type, intent.cache_lookup.festival].filter(Boolean);
    const candidatePrompts = await findPromptsByTags(tags);
    let promptId = null;
    let imageUrls = [];
    let bestMatch = { promptId, score: 0, imageUrl: null };
    if (candidatePrompts && candidatePrompts.length > 0) {
        for (const candidate of candidatePrompts) {
            if (candidate.embedding) {
                const embedding = JSON.parse(candidate.embedding);
                const similarity = cosineSimilarity(requestEmbedding, embedding);
                if (similarity > bestMatch.score) {
                    promptId = candidate.id;
                    bestMatch = {
                        promptId,
                        score: similarity,
                        imageUrl: candidate.base_s3_url || null
                    };
                }
            }
        }
    }
    if (bestMatch.score > SIMILARITY_THRESHOLD && bestMatch.imageUrl && promptId) {
        console.log(`✅ CACHE HIT! image fetched successfully Similarity: ${bestMatch.score.toFixed(2)}`);
        if (intent.request_type === "bulk")
            imageUrls = await getCachedImages(promptId);
        else
            imageUrls = [bestMatch.imageUrl];
        const mediaUrl = [];
        for (const url of imageUrls) {
            mediaUrl.push(url);
        }
        await createTwilioMessage(phone, "Here is your creative!", mediaUrl);
        return;
    }
    else {
        console.log(`❌ CACHE MISS. Best score was ${bestMatch.score.toFixed(2)}. Generating new image.`);
        const numberOfImages = (intent.request_type === "bulk") ? 4 : 1;
        let dallEPrompt = '';
        if (intent.what_to_do === 'CREATE_LOGO') {
            dallEPrompt = `A professional logo design for a ${intent.company_category} business. Style: ${intent.style || 'minimalist'}.`;
        }
        else if (intent.occasion !== null) {
            dallEPrompt = `A professional, vibrant image for the festival of ${intent.occasion} for a ${intent.company_category}. Style: ${intent.style || 'modern'}. Theme: ${intent.theme || 'celebratory'}. Color Scheme: ${intent.color_scheme || 'bright and festive'}.`;
        }
        else {
            dallEPrompt = `A high-quality creative image for a ${intent.company_category} business. Style: ${intent.style || 'modern'}. Theme: ${intent.theme || 'professional'}. Color Scheme: ${intent.color_scheme || 'clean and simple'}.`;
        }
        const genearationPromise = [];
        for (let i = 0; i < numberOfImages; i++) {
            const dallEImageUrlPromise = generateImageWithDallE(dallEPrompt);
            genearationPromise.push(dallEImageUrlPromise);
        }
        const dallEImageUrl = await Promise.all(genearationPromise);
        const validDallEUrl = dallEImageUrl.filter(url => url !== null);
        if (validDallEUrl.length === 0) {
            await createTwilioMessage(phone, "I was unable to generate any images. Please try again.");
            return;
        }
        await createTwilioMessage(phone, `I've created ${validDallEUrl.length} brand new design for you!`, validDallEUrl);
        validDallEUrl.forEach(dallEImageUrl => {
            (async () => {
                try {
                    const uniqueFilename = `${uuidv4()}.png`;
                    const newImageS3Url = await uploadImageFromUrl(dallEImageUrl, uniqueFilename);
                    await createPromptAndImage({
                        userId,
                        rawText: message,
                        processedText: message.trim().toLowerCase(),
                        tags,
                        embedding: requestEmbedding,
                        s3Url: newImageS3Url
                    });
                    console.log(`✅ Image saved to S3 and database: ${newImageS3Url}`);
                }
                catch (err) {
                    console.error("Error saving image to S3 or database:", err);
                }
            })();
        });
        return;
    }
}
//# sourceMappingURL=orchestrator.service.js.map