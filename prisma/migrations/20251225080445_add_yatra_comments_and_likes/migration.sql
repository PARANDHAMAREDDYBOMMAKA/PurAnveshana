-- CreateTable
CREATE TABLE "yatra_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yatra_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yatra_likes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "yatra_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "yatra_comments_story_id_idx" ON "yatra_comments"("story_id");

-- CreateIndex
CREATE INDEX "yatra_comments_user_id_idx" ON "yatra_comments"("user_id");

-- CreateIndex
CREATE INDEX "yatra_comments_created_at_idx" ON "yatra_comments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "yatra_likes_story_id_idx" ON "yatra_likes"("story_id");

-- CreateIndex
CREATE INDEX "yatra_likes_user_id_idx" ON "yatra_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "yatra_likes_story_id_user_id_key" ON "yatra_likes"("story_id", "user_id");

-- AddForeignKey
ALTER TABLE "yatra_comments" ADD CONSTRAINT "yatra_comments_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "yatra_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yatra_likes" ADD CONSTRAINT "yatra_likes_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "yatra_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
