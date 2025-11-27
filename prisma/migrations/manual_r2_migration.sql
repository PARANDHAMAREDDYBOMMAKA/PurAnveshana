-- Manual migration to replace Cloudinary with R2
-- This migration handles existing data by copying Cloudinary URLs to R2 fields temporarily

-- Step 1: Add new R2 columns as nullable first
ALTER TABLE "site_images" ADD COLUMN "r2_url" TEXT;
ALTER TABLE "site_images" ADD COLUMN "r2_key" TEXT;

-- Step 2: Copy existing cloudinary data to R2 fields temporarily
-- You will need to re-upload these images to R2 and update these values
UPDATE "site_images"
SET "r2_url" = "cloudinary_url",
    "r2_key" = "cloudinary_public_id";

-- Step 3: Make R2 columns NOT NULL
ALTER TABLE "site_images" ALTER COLUMN "r2_url" SET NOT NULL;
ALTER TABLE "site_images" ALTER COLUMN "r2_key" SET NOT NULL;

-- Step 4: Drop old Cloudinary columns
ALTER TABLE "site_images" DROP COLUMN "cloudinary_url";
ALTER TABLE "site_images" DROP COLUMN "cloudinary_public_id";
