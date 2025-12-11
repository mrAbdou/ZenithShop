/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItem_id_seq";
