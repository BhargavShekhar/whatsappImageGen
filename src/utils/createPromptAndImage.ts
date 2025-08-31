import { prismaClient } from "../db/prisma.js";
import { v4 as uuidv4 } from 'uuid';

export async function createPromptAndImage(data: {
    userId: string;
    rawText: string;
    processedText: string;
    tags: string[];
    embedding: number[];
    s3Url: string;
}) {
    return prismaClient.$transaction(async (tx) => {
        const newPromptId = uuidv4();
        const createdPrompt = await tx.$queryRaw<[{ id: string }]>`
            INSERT INTO "Prompt" ("id", "userId", "raw_text", "processed_text", "tags", "embedding")
            VALUES (${newPromptId}::uuid, ${data.userId}, ${data.rawText}, ${data.processedText}, ${data.tags}, ${data.embedding}::vector)
            RETURNING id;
        `;

        const promptId = createdPrompt[0].id;

        if (!promptId) throw new Error("Failed to create prompt and retrieve its ID.");

        await tx.$executeRaw`
            INSERT INTO "Image" ("id", "base_s3_url", "promptId")
            VALUES (${uuidv4()}::uuid, ${data.s3Url}, ${promptId}::uuid);
        `;

        return { id: promptId };
    })
}