/*
  Warnings:

  - A unique constraint covering the columns `[customer_id,project_code]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_code` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."projects_name_key";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "customer_id" UUID,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "project_code" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX "projects_customer_id_is_active_idx" ON "projects"("customer_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "projects_customer_id_project_code_key" ON "projects"("customer_id", "project_code");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
