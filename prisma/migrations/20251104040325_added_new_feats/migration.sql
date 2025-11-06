/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "images_user_id_fkey";

-- DropTable
DROP TABLE "public"."images";

-- CreateTable
CREATE TABLE "heritage_sites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heritage_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "site_id" UUID NOT NULL,
    "location" TEXT NOT NULL,
    "cloudinary_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "camera_model" TEXT,
    "gps_latitude" DOUBLE PRECISION,
    "gps_longitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "heritage_sites_user_id_idx" ON "heritage_sites"("user_id");

-- CreateIndex
CREATE INDEX "heritage_sites_created_at_idx" ON "heritage_sites"("created_at" DESC);

-- CreateIndex
CREATE INDEX "site_images_site_id_idx" ON "site_images"("site_id");

-- CreateIndex
CREATE INDEX "site_images_created_at_idx" ON "site_images"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "heritage_sites" ADD CONSTRAINT "heritage_sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_images" ADD CONSTRAINT "site_images_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "heritage_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
