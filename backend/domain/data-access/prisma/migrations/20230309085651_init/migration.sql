-- CreateTable
CREATE TABLE "Penalty" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
