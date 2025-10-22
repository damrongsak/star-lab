-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'LAB_ADMIN', 'CUSTOMER', 'TECHNICIAN', 'DOCTOR', 'APPROVAL');

-- CreateEnum
CREATE TYPE "TestRequestDocumentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_PAYMENT', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LabInternalStatus" AS ENUM ('WAITING_APPROVAL_LAB', 'RECEIVED_SAMPLES', 'ASSIGNED_TECHNICIAN', 'IN_PROGRESS', 'RESULTS_UPLOADED', 'REVIEWED_BY_DOCTOR', 'READY_FOR_APPROVAL', 'COMPLETED', 'RE_SCHEDULED', 'HOLD');

-- CreateEnum
CREATE TYPE "LabResultStatus" AS ENUM ('PENDING', 'PARTIAL', 'COMPLETED', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TestRequestSampleStatus" AS ENUM ('RECEIVED', 'REJECTED', 'IN_STORAGE', 'IN_TESTING', 'CONSUMED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "InvoicePaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "audit_trail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "action" VARCHAR(255) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID,
    "details" JSONB,
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_name_en" VARCHAR(255) NOT NULL,
    "company_name_th" VARCHAR(255) NOT NULL,
    "legal_entity_id" VARCHAR(100) NOT NULL,
    "company_description" TEXT,
    "company_address_line1" VARCHAR(255) NOT NULL,
    "company_province" VARCHAR(100) NOT NULL,
    "company_district" VARCHAR(100) NOT NULL,
    "company_sub_district" VARCHAR(100) NOT NULL,
    "company_zip_code" VARCHAR(20) NOT NULL,
    "company_phone" VARCHAR(50) NOT NULL,
    "company_fax" VARCHAR(50),
    "company_registration_attachments_ids" JSONB,
    "operator_id_card" VARCHAR(100) NOT NULL,
    "operator_prefix" VARCHAR(50) NOT NULL,
    "operator_first_name" VARCHAR(255) NOT NULL,
    "operator_last_name" VARCHAR(255) NOT NULL,
    "operator_mobile_phone" VARCHAR(50) NOT NULL,
    "operator_phone" VARCHAR(50),
    "operator_id_card_attachments_ids" JSONB,
    "receipt_address_building_floor_number" VARCHAR(255) NOT NULL,
    "receipt_province" VARCHAR(100) NOT NULL,
    "receipt_district" VARCHAR(100) NOT NULL,
    "receipt_sub_district" VARCHAR(100) NOT NULL,
    "receipt_zip_code" VARCHAR(20) NOT NULL,
    "receipt_phone" VARCHAR(50) NOT NULL,
    "receipt_fax" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "mime_type" VARCHAR(100),
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "uploaded_by_id" UUID,
    "uploaded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_no" VARCHAR(255) NOT NULL,
    "test_request_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "invoice_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "due_date" DATE,
    "lab_tax_info" JSONB,
    "sub_total" DECIMAL(12,2) NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0.07,
    "tax_amount" DECIMAL(12,2) NOT NULL,
    "net_total" DECIMAL(12,2) NOT NULL,
    "payment_status" "InvoicePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_slip_attachment_url" TEXT,
    "issued_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lab_test_id" UUID NOT NULL,
    "parameter" VARCHAR(255),
    "value" TEXT,
    "unit" VARCHAR(50),
    "reference_range" TEXT,
    "is_abnormal" BOOLEAN DEFAULT false,
    "notes" TEXT,
    "recorded_by_id" UUID,
    "recorded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_tests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "test_request_sample_id" UUID NOT NULL,
    "case_no" VARCHAR(255),
    "case_date" DATE,
    "assigned_lab_technician_id" UUID,
    "test_panel" VARCHAR(255),
    "test_method" VARCHAR(255),
    "lab_result_status" "LabResultStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "parent_id" UUID,
    "capacity" INTEGER,
    "current_occupancy" INTEGER DEFAULT 0,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_request_samples" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "test_request_id" UUID NOT NULL,
    "customer_sample_id" VARCHAR(255) NOT NULL,
    "sent_sample_date" DATE,
    "animal_type" VARCHAR(100),
    "sample_specimen" VARCHAR(100),
    "panel" VARCHAR(255),
    "method" VARCHAR(255),
    "requested_qty" DECIMAL(10,3) NOT NULL,
    "received_qty" DECIMAL(10,3),
    "unit" VARCHAR(50),
    "current_status" "TestRequestSampleStatus" NOT NULL DEFAULT 'RECEIVED',
    "storage_location_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_request_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "request_no" VARCHAR(255) NOT NULL,
    "customer_id" UUID NOT NULL,
    "requester_name" VARCHAR(255) NOT NULL,
    "objective" TEXT,
    "request_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "document_status" "TestRequestDocumentStatus" NOT NULL DEFAULT 'SUBMITTED',
    "lab_internal_status" "LabInternalStatus" NOT NULL DEFAULT 'WAITING_APPROVAL_LAB',
    "project_id" UUID,
    "doctor_id" UUID,
    "status" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "license_number" VARCHAR(100) NOT NULL,
    "specialization" VARCHAR(255),
    "qualifications" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "phone_number" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_email_confirmed" BOOLEAN DEFAULT false,
    "verification_token" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_legal_entity_id_key" ON "customers"("legal_entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_operator_id_card_key" ON "customers"("operator_id_card");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_no_key" ON "invoices"("invoice_no");

-- CreateIndex
CREATE UNIQUE INDEX "lab_tests_case_no_key" ON "lab_tests"("case_no");

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "test_request_samples_test_request_id_customer_sample_id_key" ON "test_request_samples"("test_request_id", "customer_sample_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_requests_request_no_key" ON "test_requests"("request_no");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_user_id_key" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_license_number_key" ON "doctors"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

-- AddForeignKey
ALTER TABLE "audit_trail" ADD CONSTRAINT "audit_trail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_attachments" ADD CONSTRAINT "document_attachments_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_test_request_id_fkey" FOREIGN KEY ("test_request_id") REFERENCES "test_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_lab_test_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "lab_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_tests" ADD CONSTRAINT "lab_tests_assigned_lab_technician_id_fkey" FOREIGN KEY ("assigned_lab_technician_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_tests" ADD CONSTRAINT "lab_tests_test_request_sample_id_fkey" FOREIGN KEY ("test_request_sample_id") REFERENCES "test_request_samples"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "storage_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_request_samples" ADD CONSTRAINT "test_request_samples_storage_location_id_fkey" FOREIGN KEY ("storage_location_id") REFERENCES "storage_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_request_samples" ADD CONSTRAINT "test_request_samples_test_request_id_fkey" FOREIGN KEY ("test_request_id") REFERENCES "test_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_requests" ADD CONSTRAINT "test_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_requests" ADD CONSTRAINT "test_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_requests" ADD CONSTRAINT "test_requests_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
