-- CreateTable
CREATE TABLE "yatra_saved" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "yatra_saved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "yatra_saved_story_id_idx" ON "yatra_saved"("story_id");

-- CreateIndex
CREATE INDEX "yatra_saved_user_id_idx" ON "yatra_saved"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "yatra_saved_story_id_user_id_key" ON "yatra_saved"("story_id", "user_id");

-- AddForeignKey
ALTER TABLE "yatra_saved" ADD CONSTRAINT "yatra_saved_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "yatra_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
