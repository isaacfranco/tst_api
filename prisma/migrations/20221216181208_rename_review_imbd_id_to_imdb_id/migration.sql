/*
  Warnings:

  - You are about to drop the column `imbdID` on the `Review` table. All the data in the column will be lost.
  - Added the required column `imdbID` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `imbdID`,
    ADD COLUMN `imdbID` VARCHAR(191) NOT NULL;
