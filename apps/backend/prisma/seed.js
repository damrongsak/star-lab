import {
  PrismaClient,
  UserRole,
  InvoicePaymentStatus,
  TestRequestDocumentStatus,
  LabInternalStatus,
  LabResultStatus,
  TestRequestSampleStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import process from "process";
const prisma = new PrismaClient();

async function main() {
  // 1. Create users
  const users = [
    { email: "admin@starlab.com", role: UserRole.ADMIN },
    { email: "customer@starlab.com", role: UserRole.CUSTOMER },
  ];

  const userRecords = {};

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        role: user.role,
        passwordHash: await bcrypt.hash("mock-password", 10),
        isEmailConfirmed: true,
        verificationToken: null,
      },
    });
    userRecords[user.role] = createdUser;
  }

  // 2. Create customer for CUSTOMER user
  const customer = await prisma.customer.upsert({
    where: { userId: userRecords[UserRole.CUSTOMER].id },
    update: {},
    create: {
      userId: userRecords[UserRole.CUSTOMER].id,
      companyNameEn: "Star Lab Co., Ltd.",
      companyNameTh: "บริษัท สตาร์แลบ จำกัด",
      legalEntityId: "0105551234567",
      companyDescription: "A mock testing laboratory for seeding.",
      companyAddressLine1: "123/4 Mock Road, Bangkok",
      companyProvince: "Bangkok",
      companyDistrict: "Pathumwan",
      companySubDistrict: "Lumphini",
      companyZipCode: "10330",
      companyPhone: "021234567",
      companyFax: "021234568",
      companyRegistrationAttachmentsIds: [],
      operatorIdCard: "1234567890123",
      operatorPrefix: "Mr.",
      operatorFirstName: "Mocker",
      operatorLastName: "Customer",
      operatorMobilePhone: "0812345678",
      operatorPhone: "026543210",
      operatorIdCardAttachmentsIds: [],
      receiptAddressBuildingFloorNumber: "12A",
      receiptProvince: "Bangkok",
      receiptDistrict: "Pathumwan",
      receiptSubDistrict: "Lumphini",
      receiptZipCode: "10330",
      receiptPhone: "021234567",
      receiptFax: "021234568",
    },
  });

  // 3. Create or update project
  const project = await prisma.project.upsert({
    where: { name: "Mock Research Project" },
    update: {},
    create: {
      name: "Mock Research Project",
      description: "Initial research for mockup data testing",
      createdById: userRecords[UserRole.CUSTOMER].id,
    },
  });

  // 4. Create multiple test requests with different statuses
  const testRequests = [];

  // Test Request 1: DRAFT
  testRequests.push(await prisma.testRequest.create({
    data: {
      requestNo: "STAR-20251101-001",
      customerId: customer.id,
      requesterName: "John Doe",
      objective: "Quality control testing",
      notes: "Please expedite this request",
      documentStatus: TestRequestDocumentStatus.DRAFT,
      labInternalStatus: LabInternalStatus.PENDING,
      projectId: project.id,
    },
  }));

  // Test Request 2: SUBMITTED
  testRequests.push(await prisma.testRequest.create({
    data: {
      requestNo: "STAR-20251031-001",
      customerId: customer.id,
      requesterName: "Jane Smith",
      objective: "Research sample analysis",
      documentStatus: TestRequestDocumentStatus.SUBMITTED,
      labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
      projectId: project.id,
    },
  }));

  // Test Request 3: PENDING_PAYMENT
  testRequests.push(await prisma.testRequest.create({
    data: {
      requestNo: "STAR-20251030-002",
      customerId: customer.id,
      requesterName: "Bob Johnson",
      objective: "Routine health screening",
      documentStatus: TestRequestDocumentStatus.PENDING_PAYMENT,
      labInternalStatus: LabInternalStatus.COMPLETED,
      projectId: project.id,
    },
  }));

  // Test Request 4: APPROVED
  testRequests.push(await prisma.testRequest.create({
    data: {
      requestNo: "STAR-20251029-001",
      customerId: customer.id,
      requesterName: "Alice Williams",
      objective: "Clinical trial samples",
      documentStatus: TestRequestDocumentStatus.APPROVED,
      labInternalStatus: LabInternalStatus.COMPLETED,
    },
  }));

  // Test Request 5: REJECTED
  testRequests.push(await prisma.testRequest.create({
    data: {
      requestNo: "STAR-20251028-003",
      customerId: customer.id,
      requesterName: "Charlie Brown",
      objective: "Environmental testing",
      notes: "Samples received in poor condition",
      documentStatus: TestRequestDocumentStatus.REJECTED,
      labInternalStatus: LabInternalStatus.CANCELLED,
    },
  }));

  // 5. Create samples for requests
  const samples = [];

  // Sample for Request 1 (DRAFT)
  samples.push(await prisma.testRequestSample.create({
    data: {
      testRequestId: testRequests[0].id,
      customerSampleId: "SAMP-2025-001",
      sentSampleDate: new Date("2025-11-01"),
      animalType: "Dog",
      sampleSpecimen: "Blood",
      panel: "Complete Blood Count",
      method: "Automated Analyzer",
      requestedQty: 2,
      unit: "tubes",
      currentStatus: TestRequestSampleStatus.PENDING,
    },
  }));

  // Sample for Request 2 (SUBMITTED)
  samples.push(await prisma.testRequestSample.create({
    data: {
      testRequestId: testRequests[1].id,
      customerSampleId: "SAMP-2025-002",
      sentSampleDate: new Date("2025-10-31"),
      animalType: "Cat",
      sampleSpecimen: "Serum",
      panel: "Biochemistry Panel",
      method: "ELISA",
      requestedQty: 1,
      receivedQty: 1,
      unit: "ml",
      currentStatus: TestRequestSampleStatus.RECEIVED,
    },
  }));

  // Another sample for Request 2
  samples.push(await prisma.testRequestSample.create({
    data: {
      testRequestId: testRequests[1].id,
      customerSampleId: "SAMP-2025-003",
      sentSampleDate: new Date("2025-10-31"),
      animalType: "Cat",
      sampleSpecimen: "Tissue",
      panel: "Histopathology",
      method: "Microscopy",
      requestedQty: 3,
      receivedQty: 3,
      unit: "slides",
      currentStatus: TestRequestSampleStatus.RECEIVED,
    },
  }));

  const testRequest = testRequests[1]; // Use SUBMITTED request for invoice
  const sample = samples[1]; // Use first sample of SUBMITTED request

  // 6. Create lab test
  const labTest = await prisma.labTest.create({
    data: {
      testRequestSampleId: sample.id,
      caseNo: "CASE-001",
      caseDate: new Date(),
      testPanel: "Complete Blood Count",
      testMethod: "Spectrophotometry",
      labResultStatus: LabResultStatus.PENDING,
    },
  });

  // 7. Create lab result
  await prisma.labResult.create({
    data: {
      labTestId: labTest.id,
      parameter: "Hemoglobin",
      value: "13.5",
      unit: "g/dL",
      referenceRange: "12-16",
      isAbnormal: false,
      notes: "Within normal range",
    },
  });

  // 8. Create invoice
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNo: "INV-001",
      testRequestId: testRequest.id,
      customerId: customer.id,
      subTotal: 500.0,
      taxAmount: 35.0,
      netTotal: 535.0,
      paymentStatus: InvoicePaymentStatus.PENDING,
    },
  });

  // 9. Create invoice line item
  await prisma.invoiceLineItem.create({
    data: {
      invoiceId: invoice.id,
      description: "CBC Test",
      quantity: 1,
      unitPrice: 500.0,
      lineTotal: 500.0,
    },
  });

  globalThis.console.log("✅ Full mock dataset seeded successfully.");
}

main()
  .catch((e) => {
    globalThis.console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
