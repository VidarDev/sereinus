-- CreateTable
CREATE TABLE "Crisis" (
    "userId" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "Crisis_pkey" PRIMARY KEY ("userId","datetime")
);

-- CreateTable
CREATE TABLE "BreathingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "protocolId" TEXT NOT NULL,
    "protocolName" TEXT NOT NULL,
    "cycleCount" INTEGER NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "averageCycleTime" DOUBLE PRECISION NOT NULL,
    "note" TEXT,

    CONSTRAINT "BreathingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BreathingSession_userId_datetime_idx" ON "BreathingSession"("userId", "datetime");
