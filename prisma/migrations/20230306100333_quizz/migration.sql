-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(191) NULL,
    `Password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Born_Date` DATETIME(3) NOT NULL,
    `Dead_Date` DATETIME(3) NOT NULL,
    `Picture` VARCHAR(191) NOT NULL,
    `lien_Wiki` VARCHAR(191) NOT NULL,
    `Painting_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Painting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Image_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Artists` ADD CONSTRAINT `Artists_Painting_id_fkey` FOREIGN KEY (`Painting_id`) REFERENCES `Painting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
