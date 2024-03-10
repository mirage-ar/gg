-- CreateTable
CREATE TABLE "Codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Codes_code_key" ON "Codes"("code");
