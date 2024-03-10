/*
  Warnings:

  - You are about to drop the `Codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Codes";

-- CreateTable
CREATE TABLE "Code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");
