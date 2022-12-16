/*
  Warnings:

  - Added the required column `text` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` ADD COLUMN `stars` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `text` VARCHAR(191) NOT NULL;
