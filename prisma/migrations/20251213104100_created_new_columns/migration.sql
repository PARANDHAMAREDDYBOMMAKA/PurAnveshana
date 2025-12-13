-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('TEMPLE', 'FORT_PALACE', 'CAVES_ROCK_CUT', 'RUINS', 'INSCRIPTIONS', 'ROCK_ART', 'MEGALITHIC_SITE', 'BURIAL_SITE', 'WATER_STRUCTURE', 'ANCIENT_SETTLEMENT', 'ARTIFACT_FOUND', 'OTHER');

-- AlterTable
ALTER TABLE "heritage_sites" ADD COLUMN     "reference_links" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE INDEX "heritage_sites_type_idx" ON "heritage_sites"("type");
