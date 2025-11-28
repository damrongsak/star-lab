-- CreateTable
CREATE TABLE "public"."request_sequences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_code" VARCHAR(50) NOT NULL,
    "date" VARCHAR(8) NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "request_sequences_company_code_date_key" ON "public"."request_sequences"("company_code", "date");

