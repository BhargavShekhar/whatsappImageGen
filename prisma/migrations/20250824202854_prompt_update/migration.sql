/*
  Warnings:

  - You are about to drop the column `bytes` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `phash` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `businessType` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `festivalId` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `normalized` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the `Festival` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `processed_text` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raw_text` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Prompt" DROP CONSTRAINT "Prompt_festivalId_fkey";

-- DropIndex
DROP INDEX "public"."Image_phash_idx";

-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "bytes",
DROP COLUMN "format",
DROP COLUMN "height",
DROP COLUMN "phash",
DROP COLUMN "width";

-- AlterTable
ALTER TABLE "public"."Prompt" DROP COLUMN "businessType",
DROP COLUMN "content",
DROP COLUMN "festivalId",
DROP COLUMN "normalized",
DROP COLUMN "signature",
ADD COLUMN     "processed_text" TEXT NOT NULL,
ADD COLUMN     "raw_text" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "public"."Festival";
