-- Create a new Test Request in WAITING_APPROVAL_LAB status
WITH new_request AS (
  INSERT INTO test_requests (
    id, request_no, customer_id, requester_name, objective, request_date, 
    document_status, lab_internal_status, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), 
    'REQ-VERIFY-001', 
    (SELECT id FROM customers LIMIT 1), 
    'Verification User', 
    'Verify Acknowledge Flow', 
    CURRENT_DATE, 
    'SUBMITTED', 
    'WAITING_APPROVAL_LAB', 
    NOW(), 
    NOW()
  )
  RETURNING id
)
INSERT INTO test_request_samples (
  id, test_request_id, customer_sample_id, sent_sample_date, animal_type, 
  sample_specimen, panel, requested_qty, unit, current_status, created_at, updated_at
) VALUES 
(
  gen_random_uuid(), 
  (SELECT id FROM new_request), 
  'SAMP-VERIFY-001', 
  CURRENT_DATE, 
  'Dog', 
  'Blood', 
  'CBC', 
  1, 
  'tube', 
  'RECEIVED', -- Initially RECEIVED by system, but lab needs to acknowledge? 
              -- Actually, if it's WAITING_APPROVAL_LAB, samples might be 'RECEIVED' physically but not acknowledged in system?
              -- Let's set status to 'RECEIVED' as per seed data for new requests.
              -- Wait, the Acknowledge page usually transitions them or just confirms?
              -- Let's check the code.
  NOW(), 
  NOW()
),
(
  gen_random_uuid(), 
  (SELECT id FROM new_request), 
  'SAMP-VERIFY-002', 
  CURRENT_DATE, 
  'Cat', 
  'Urine', 
  'Urinalysis', 
  1, 
  'cup', 
  'RECEIVED', 
  NOW(), 
  NOW()
);
