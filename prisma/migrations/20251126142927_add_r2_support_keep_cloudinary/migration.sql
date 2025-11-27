-- AlterTable
ALTER TABLE "site_images" ADD COLUMN     "r2_key" TEXT,
ADD COLUMN     "r2_url" TEXT,
ALTER COLUMN "cloudinary_url" DROP NOT NULL,
ALTER COLUMN "cloudinary_public_id" DROP NOT NULL;
