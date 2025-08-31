/*
  Warnings:

  - You are about to drop the column `embedding_vec` on the `Prompt` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Prompt_embedding_vec_idx";

-- AlterTable
ALTER TABLE "public"."Prompt" DROP COLUMN "embedding_vec",
ADD COLUMN     "embedding" vector(1536);

-- CreateIndex
CREATE INDEX "Prompt_embedding_idx" ON "public"."Prompt"("embedding");
