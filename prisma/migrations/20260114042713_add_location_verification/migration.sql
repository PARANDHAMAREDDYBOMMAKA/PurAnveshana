-- CreateEnum
CREATE TYPE "LocationVerificationStatus" AS ENUM ('PENDING', 'PASSED', 'FLAGGED', 'ERROR');

-- AlterTable
ALTER TABLE "yatra_stories" ADD COLUMN     "location_verification_result" JSONB,
ADD COLUMN     "location_verification_status" "LocationVerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "location_verified_at" TIMESTAMP(3);
