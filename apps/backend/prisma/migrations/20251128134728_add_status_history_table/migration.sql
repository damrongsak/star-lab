-- AlterEnum
ALTER TYPE "InvoicePaymentStatus" ADD VALUE 'WAITING_VERIFICATION';

-- AlterEnum
ALTER TYPE "TestRequestSampleStatus" ADD VALUE 'COMPLETED';

-- CreateTable
CREATE TABLE "test_request_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "test_request_id" UUID NOT NULL,
    "from_status" "TestRequestDocumentStatus",
    "to_status" "TestRequestDocumentStatus" NOT NULL,
    "changed_by_id" UUID,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "test_request_status_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "test_request_status_history" ADD CONSTRAINT "test_request_status_history_test_request_id_fkey" FOREIGN KEY ("test_request_id") REFERENCES "test_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_request_status_history" ADD CONSTRAINT "test_request_status_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
