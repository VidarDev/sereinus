/*
  Warnings:

  - The primary key for the `Crisis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `BreathingSession` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `Crisis` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Crisis" DROP CONSTRAINT "Crisis_pkey",
ADD COLUMN     "averageCycleTime" DOUBLE PRECISION,
ADD COLUMN     "cycleCount" INTEGER,
ADD COLUMN     "efficiency" DOUBLE PRECISION,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "protocolId" TEXT,
ADD COLUMN     "protocolName" TEXT,
ADD CONSTRAINT "Crisis_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "BreathingSession";

-- CreateIndex
CREATE INDEX "Crisis_userId_datetime_idx" ON "Crisis"("userId", "datetime");
