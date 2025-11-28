-- AlterTable
ALTER TABLE "test_requests" ADD COLUMN     "approved_at" TIMESTAMPTZ(6),
ADD COLUMN     "approved_by_id" UUID,
ADD COLUMN     "rejected_at" TIMESTAMPTZ(6),
ADD COLUMN     "rejection_reason" TEXT;

-- AddForeignKey
ALTER TABLE "test_requests" ADD CONSTRAINT "test_requests_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
