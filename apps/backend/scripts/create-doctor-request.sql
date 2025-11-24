-- Create a new Test Request in RESULT_READY status with results
WITH new_request AS (
  INSERT INTO test_requests (
    id, request_no, customer_id, requester_name, objective, request_date, 
    document_status, lab_internal_status, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), 
    'REQ-DOCTOR-001', 
    (SELECT id FROM customers LIMIT 1), 
    'Doctor Verification User', 
    'Verify Doctor Approval', 
    CURRENT_DATE, 
    'RESULT_READY', 
    'READY_FOR_APPROVAL', 
    NOW(), 
    NOW()
  )
  RETURNING id
),
new_sample AS (
  INSERT INTO test_request_samples (
    id, test_request_id, customer_sample_id, sent_sample_date, animal_type, 
    sample_specimen, panel, requested_qty, unit, current_status, created_at, updated_at
  ) 
  SELECT 
    gen_random_uuid(), 
    id, 
    'SAMP-DOC-001', 
    CURRENT_DATE, 
    'Dog', 
    'Serum', 
    'Biochemistry', 
    1, 
    'tube', 
    'CONSUMED', 
    NOW(), 
    NOW()
  FROM new_request
  RETURNING id
),
new_test AS (
  INSERT INTO lab_tests (
    id, test_request_sample_id, case_no, case_date, test_panel, test_method, 
    lab_result_status, created_at, updated_at
  )
  SELECT
    gen_random_uuid(),
    id,
    'CASE-DOC-001',
    NOW(),
    'Biochemistry',
    'Analyzer',
    'COMPLETED',
    NOW(),
    NOW()
  FROM new_sample
  RETURNING id
)
INSERT INTO lab_results (
  id, lab_test_id, parameter, value, unit, reference_range, is_abnormal, recorded_at
)
SELECT
  gen_random_uuid(),
  id,
  'Glucose',
  '120',
  'mg/dL',
  '70-143',
  false,
  NOW()
FROM new_test;
