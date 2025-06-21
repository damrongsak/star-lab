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

  // 3. Create project
  const project = await prisma.project.create({
    data: {
      name: "Mock Research Project",
      description: "Initial research for mockup data testing",
      createdById: userRecords[UserRole.CUSTOMER].id,
    },
  });

  // 4. Create test request
  const testRequest = await prisma.testRequest.create({
    data: {
      requestNo: "REQ-001",
      customerId: customer.id,
      requesterName: "John Doe",
      objective: "Routine testing",
      documentStatus: TestRequestDocumentStatus.SUBMITTED,
      labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
      projectId: project.id,
    },
  });

  // 5. Create sample
  const sample = await prisma.testRequestSample.create({
    data: {
      testRequestId: testRequest.id,
      customerSampleId: "CUST-SMP-001",
      sentSampleDate: new Date(),
      animalType: "Canine",
      sampleSpecimen: "Blood",
      panel: "CBC",
      method: "ELISA",
      requestedQty: 1,
      receivedQty: 1,
      unit: "ml",
      currentStatus: TestRequestSampleStatus.RECEIVED,
    },
  });

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
