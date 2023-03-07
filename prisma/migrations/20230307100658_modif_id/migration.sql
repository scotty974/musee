/*
  Warnings:

  - A unique constraint covering the columns `[uuId]` on the table `Painting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuId` to the `Painting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Artists` DROP FOREIGN KEY `Artists_Painting_id_fkey`;

-- AlterTable
ALTER TABLE `Artists` MODIFY `Painting_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Painting` ADD COLUMN `uuId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Painting_uuId_key` ON `Painting`(`uuId`);

-- AddForeignKey
ALTER TABLE `Artists` ADD CONSTRAINT `Artists_Painting_id_fkey` FOREIGN KEY (`Painting_id`) REFERENCES `Painting`(`uuId`) ON DELETE RESTRICT ON UPDATE CASCADE;
