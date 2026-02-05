-- AlterTable
ALTER TABLE "heritage_sites" ADD COLUMN     "yatra_story_prompted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "yatra_stories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "heritage_site_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "journey_narrative" TEXT NOT NULL,
    "cultural_insights" TEXT NOT NULL,
    "additional_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yatra_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "yatra_stories_heritage_site_id_key" ON "yatra_stories"("heritage_site_id");

-- CreateIndex
CREATE INDEX "yatra_stories_user_id_idx" ON "yatra_stories"("user_id");

-- CreateIndex
CREATE INDEX "yatra_stories_is_published_idx" ON "yatra_stories"("is_published");

-- CreateIndex
CREATE INDEX "yatra_stories_created_at_idx" ON "yatra_stories"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "yatra_stories" ADD CONSTRAINT "yatra_stories_heritage_site_id_fkey" FOREIGN KEY ("heritage_site_id") REFERENCES "heritage_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
