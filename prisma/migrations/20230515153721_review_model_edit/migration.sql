/*
  Warnings:

  - You are about to drop the column `content` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `review` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReadStatus" AS ENUM ('tbr', 'reading', 'read', 'notRead');

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "coverUrl" DROP NOT NULL,
ALTER COLUMN "numPages" DROP NOT NULL,
ALTER COLUMN "publisher" DROP NOT NULL,
ALTER COLUMN "yearPublished" DROP NOT NULL,
ALTER COLUMN "ReadStatus" SET DEFAULT 'notRead';

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "content",
ADD COLUMN     "review" TEXT NOT NULL;
