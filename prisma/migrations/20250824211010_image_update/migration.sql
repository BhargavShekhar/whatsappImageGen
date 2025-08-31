/*
  Warnings:

  - You are about to drop the column `s3_key` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `watermarked` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[base_s3_url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `base_s3_url` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "s3_key",
DROP COLUMN "url",
DROP COLUMN "watermarked",
ADD COLUMN     "base_s3_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_base_s3_url_key" ON "public"."Image"("base_s3_url");
