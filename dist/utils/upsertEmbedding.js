import { prismaClient } from "../db/prisma.js";
import { embdText } from "./embedding.js";
import { toVectorSQLLiteral } from "./toVectorSQLLiteral.js";
export async function upsertEmbeddingPrompt(promptId, text) {
    const vec = await embdText(text);
    if (!vec) {
        console.log("upsertEmbeddingPrompt :: vec is undefined");
        return;
    }
    const normalized = text.trim().toLowerCase();
    await prismaClient.$executeRawUnsafe(`
        UPDATE "Prompt"
        SET "normalized" = $1,
            "embedding_vec" = ${toVectorSQLLiteral(vec)}::vector
        WHERE "id" = $2
        `, normalized, promptId);
}
//# sourceMappingURL=upsertEmbedding.js.map