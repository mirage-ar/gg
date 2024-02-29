-- CreateTable
CREATE TABLE "Points" (
    "id" TEXT NOT NULL,
    "twitterId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "boost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Points_twitterId_key" ON "Points"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Points_username_key" ON "Points"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Points_wallet_key" ON "Points"("wallet");
