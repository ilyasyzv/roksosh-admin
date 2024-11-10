/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Size` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
