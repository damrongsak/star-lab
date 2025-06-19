import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("document_request").del();

  // Generate some sample user and company IDs (replace with actual IDs from your users and companies tables)
  const userIds = [1, 2, 3];
  const companyIds = [10, 11];
  const requestDates = [
    new Date(),
    new Date(Date.now() - 86400000), // Yesterday
    new Date(Date.now() - 2 * 86400000), // Two days ago
  ];

  // Insert seed entries
  await knex("document_request").insert([
    {
      request_no: uuidv4().substring(0, 8).toUpperCase() + "-DOC",
      request_date: requestDates[0],
      user_id: userIds[0],
      company_id: companyIds[0],
      document_type: "Invoice",
      description: "Request for the latest invoice for services rendered.",
      status: "completed",
      paid_status: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      request_no: uuidv4().substring(0, 8).toUpperCase() + "-APP",
      request_date: requestDates[1],
      user_id: userIds[1],
      company_id: companyIds[1],
      document_type: "Leave Application",
      description: "Request for annual leave from 2025-05-15 to 2025-05-22.",
      status: "approved",
      paid_status: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      request_no: uuidv4().substring(0, 8).toUpperCase() + "-RPT",
      request_date: requestDates[2],
      user_id: userIds[2],
      company_id: companyIds[0],
      document_type: "Expense Report",
      description: "Monthly expense report for March 2025.",
      status: "pending",
      paid_status: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      request_no: "MANUAL-001",
      request_date: new Date(Date.now() - 3 * 86400000),
      user_id: userIds[0],
      company_id: companyIds[1],
      document_type: "Contract",
      description: "Request for a copy of the signed service contract.",
      status: "processing",
      paid_status: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      request_no: uuidv4().substring(0, 8).toUpperCase() + "-REQ",
      request_date: requestDates[0],
      user_id: userIds[1],
      company_id: companyIds[0],
      document_type: "Purchase Order",
      description: "Request for purchase order #PO-2025-04-22.",
      status: "completed",
      paid_status: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
