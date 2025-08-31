import { prismaClient } from "../db/prisma.js";

interface PromptWithEmbedding {
    id: string;
    embedding: string | null;
    base_s3_url: string | null;
}

export async function findPromptsByTags(tags: string[]): Promise<PromptWithEmbedding[]> {
    const prompts = await prismaClient.$queryRaw<PromptWithEmbedding[]>`
        SELECT
            p.id,
            p.embedding::text as embedding, 
            (
                SELECT i.base_s3_url
                FROM "Image" i
                WHERE i."promptId" = p.id
                ORDER BY i."createdAt" DESC
                LIMIT 1
            ) as base_s3_url
        FROM "Prompt" p
        WHERE p.tags @> ${tags}
    `

    return prompts;
}