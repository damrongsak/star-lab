import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("sample_list").del();

  // Insert sample document_request data (assuming these exist)
  const documentRequests = await knex("document_request")
    .select("request_no")
    .limit(2);
  if (documentRequests.length < 2) {
    throw new Error(
      "Please ensure there are at least 2 document requests in the document_request table before seeding sample_list.",
    );
  }

  // Inserts seed entries
  await knex("sample_list").insert([
    {
      request_no: documentRequests[0].request_no,
      sent_sample_date: "2024-09-10",
      animal_type: "Cow",
      sample_specimen: "Whole Blood",
      panel: "PRRS (Typing EU / US / HP)",
      method: "Real - Time PCR",
      sample_qty: 1,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      request_no: documentRequests[1].request_no,
      sent_sample_date: "2024-09-10",
      animal_type: "Cow",
      sample_specimen: "Serum",
      panel: "PCV (Typing 2/3)",
      method: "Elisa",
      sample_qty: 1,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
