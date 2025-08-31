import { prismaClient } from "../db/prisma.js";
export async function findPromptsByTags(tags) {
    const prompts = await prismaClient.$queryRaw `
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
    `;
    return prompts;
}
//# sourceMappingURL=findPromptsByTags.js.map