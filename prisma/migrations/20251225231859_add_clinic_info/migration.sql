-- AlterTable
ALTER TABLE "User" ADD COLUMN "clinicAddress" TEXT DEFAULT 'Endereço não configurado';
ALTER TABLE "User" ADD COLUMN "clinicName" TEXT DEFAULT 'Virtus Clinical';
ALTER TABLE "User" ADD COLUMN "clinicPhone" TEXT DEFAULT '(00) 0000-0000';
