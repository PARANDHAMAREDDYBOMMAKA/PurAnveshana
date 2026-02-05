-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMENT', 'COMMENT_REPLY', 'LIKE', 'STORY_APPROVED', 'STORY_FEATURED', 'STORY_REJECTED', 'SYSTEM');

-- CreateTable
CREATE TABLE "yatra_story_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "discovery_context" TEXT NOT NULL,
    "journey_narrative" TEXT NOT NULL,
    "historical_indicators" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "historical_indicators_details" TEXT,
    "evidence_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "safe_visuals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "personal_reflection" TEXT,
    "cultural_insights" TEXT,
    "publish_status" "PublishStatus" NOT NULL,
    "edited_by" UUID NOT NULL,
    "change_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "yatra_story_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "related_id" UUID,
    "actor_id" UUID,
    "actor_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "email_comments" BOOLEAN NOT NULL DEFAULT true,
    "email_likes" BOOLEAN NOT NULL DEFAULT true,
    "email_story_approval" BOOLEAN NOT NULL DEFAULT true,
    "email_story_featured" BOOLEAN NOT NULL DEFAULT true,
    "push_comments" BOOLEAN NOT NULL DEFAULT true,
    "push_likes" BOOLEAN NOT NULL DEFAULT true,
    "push_story_approval" BOOLEAN NOT NULL DEFAULT true,
    "push_story_featured" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "yatra_story_versions_story_id_idx" ON "yatra_story_versions"("story_id");

-- CreateIndex
CREATE INDEX "yatra_story_versions_created_at_idx" ON "yatra_story_versions"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "yatra_story_versions_story_id_version_number_key" ON "yatra_story_versions"("story_id", "version_number");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "yatra_story_versions" ADD CONSTRAINT "yatra_story_versions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "yatra_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
