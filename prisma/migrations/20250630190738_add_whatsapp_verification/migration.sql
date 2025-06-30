-- CreateTable
CREATE TABLE "WhatsappVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappVerificationToken_token_key" ON "WhatsappVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappVerificationToken_userId_key" ON "WhatsappVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "WhatsappVerificationToken" ADD CONSTRAINT "WhatsappVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
