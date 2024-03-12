/*
  Warnings:

  - You are about to drop the column `claimed` on the `Code` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Code" DROP COLUMN "claimed",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;
