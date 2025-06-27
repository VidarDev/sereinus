/*
  Warnings:

  - The primary key for the `Crisis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Crisis` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Crisis_userId_datetime_idx";

-- AlterTable
ALTER TABLE "Crisis" DROP CONSTRAINT "Crisis_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Crisis_pkey" PRIMARY KEY ("userId", "datetime");
