/*
  Warnings:

  - You are about to drop the column `embedding` on the `Prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Prompt" DROP COLUMN "embedding";

-- CreateIndex
CREATE INDEX "Prompt_embedding_vec_idx" ON "public"."Prompt"("embedding_vec");
