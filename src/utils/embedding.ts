import { openAi } from "../services/openAi.service.js";

export async function embdText(text: string) {
    const input = text.trim().toLowerCase();
    
    const res = await openAi.embeddings.create({
        model: "text-embedding-3-small",
        input
    })

    return res.data[0]?.embedding;
}

export function cosineSimilarity(vecA: number[], vecB: number[]) {
    if(!vecA || !vecB) {
        console.log("cosineSimilarity:: vector's are undefined");
        return -1;
    }

    if(vecA.length !== vecB.length) {
        console.log("cosineSimilarity:: vector's have different length");
        return -1;
    }

    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i]!, 0);

    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return dot / (normA * normB);
}