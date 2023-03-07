/*
  Warnings:

  - You are about to drop the column `Picture` on the `Artists` table. All the data in the column will be lost.
  - You are about to drop the column `lien_Wiki` on the `Artists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Artists` DROP COLUMN `Picture`,
    DROP COLUMN `lien_Wiki`;
