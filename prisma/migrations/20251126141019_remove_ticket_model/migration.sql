/*
  Warnings:

  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tickets" DROP CONSTRAINT "tickets_user_id_fkey";

-- DropTable
DROP TABLE "public"."tickets";

-- DropEnum
DROP TYPE "public"."TicketStatus";
