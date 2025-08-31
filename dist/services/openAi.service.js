import OpenAI from "openai";
import dotenv from 'dotenv';
import { systemPrompt } from "../constants/systemPrompt.js";
dotenv.config({ override: true });
export const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function parseMessageWithGPT(message) {
    const response = await openAi.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
        ],
        response_format: { type: "json_object" },
    });
    const jsonResponse = response.choices?.[0]?.message.content;
    return JSON.parse(jsonResponse);
}
export async function generateImageWithDallE(prompt) {
    const response = await openAi.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
    });
    return response.data?.[0]?.url || null;
}
//# sourceMappingURL=openAi.service.js.map