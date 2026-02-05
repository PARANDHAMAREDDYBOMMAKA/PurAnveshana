/*
  Warnings:

  - You are about to drop the column `additional_images` on the `yatra_stories` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `yatra_stories` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `yatra_stories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(80)`.
  - Added the required column `discovery_context` to the `yatra_stories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED_PUBLIC', 'FEATURED_YATRA');

-- DropIndex
DROP INDEX "public"."yatra_stories_is_published_idx";

-- AlterTable
ALTER TABLE "yatra_stories" DROP COLUMN "additional_images",
DROP COLUMN "is_published",
ADD COLUMN     "discovery_context" TEXT NOT NULL,
ADD COLUMN     "evidence_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "historical_indicators" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "historical_indicators_details" TEXT,
ADD COLUMN     "personal_reflection" TEXT,
ADD COLUMN     "publish_status" "PublishStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "safe_visuals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "submission_confirmed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(80),
ALTER COLUMN "cultural_insights" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "yatra_stories_publish_status_idx" ON "yatra_stories"("publish_status");
