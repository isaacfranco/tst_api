/*
  Warnings:

  - You are about to drop the column `movieId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `imbdID` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_movieId_fkey`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `movieId`,
    ADD COLUMN `imbdID` VARCHAR(191) NOT NULL;
