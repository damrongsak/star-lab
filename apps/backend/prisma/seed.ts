import {
    PrismaClient,
    UserRole,
    InvoicePaymentStatus,
    TestRequestDocumentStatus,
    LabInternalStatus,
    LabResultStatus,
    TestRequestSampleStatus,
    User,
    Customer,
    Project,
    TestRequest,
    TestRequestSample,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import process from 'process';

const prisma = new PrismaClient();

// Define a type for the user records map for better type safety
type UserRecords = {
    [key in UserRole]?: User;
};

async function main() {
    globalThis.console.log('Start seeding process...');

    // 1. Create users
    const users = [
        { email: 'admin@starlab.com', role: UserRole.ADMIN },
        { email: 'customer@starlab.com', role: UserRole.CUSTOMER },
    ];

    const userRecords: UserRecords = {};

    for (const user of users) {
        const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                role: user.role,
                passwordHash: await bcrypt.hash('mock-password', 10),
                isEmailConfirmed: true,
                verificationToken: null,
            },
        });
        userRecords[user.role] = createdUser;
        globalThis.console.log(`👤 Upserted user: ${createdUser.email}`);
    }

    // Ensure customer user exists before proceeding
    const customerUser = userRecords[UserRole.CUSTOMER];
    if (!customerUser) {
        throw new Error('Customer user failed to be created/retrieved.');
    }

    // 2. Create customer for CUSTOMER user
    const customer: Customer = await prisma.customer.upsert({
        where: { userId: customerUser.id },
        update: {},
        create: {
            userId: customerUser.id,
            companyNameEn: 'Star Lab Co., Ltd.',
            companyNameTh: 'บริษัท สตาร์แลบ จำกัด',
            legalEntityId: '0105551234567',
            companyDescription: 'A mock testing laboratory for seeding.',
            companyAddressLine1: '123/4 Mock Road, Bangkok',
            companyProvince: 'Bangkok',
            companyDistrict: 'Pathumwan',
            companySubDistrict: 'Lumphini',
            companyZipCode: '10330',
            companyPhone: '021234567',
            companyFax: '021234568',
            companyRegistrationAttachmentsIds: [],
            operatorIdCard: '1234567890123',
            operatorPrefix: 'Mr.',
            operatorFirstName: 'Mocker',
            operatorLastName: 'Customer',
            operatorMobilePhone: '0812345678',
            operatorPhone: '026543210',
            operatorIdCardAttachmentsIds: [],
            receiptAddressBuildingFloorNumber: '12A',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Pathumwan',
            receiptSubDistrict: 'Lumphini',
            receiptZipCode: '10330',
            receiptPhone: '021234567',
            receiptFax: '021234568',
        },
    });
    globalThis.console.log(`🏢 Upserted customer: ${customer.companyNameEn}`);

    // 3. Create or update project
    const project: Project = await prisma.project.upsert({
        where: { name: 'Mock Research Project' },
        update: {},
        create: {
            name: 'Mock Research Project',
            description: 'Initial research for mockup data testing',
            createdById: customerUser.id,
        },
    });
    globalThis.console.log(`📑 Upserted project: ${project.name}`);

    // 4. Create multiple test requests with different statuses
    const testRequests: TestRequest[] = [];

    const requestsData = [
        {
            requestNo: 'STAR-20251101-001',
            requesterName: 'John Doe',
            objective: 'Quality control testing',
            documentStatus: TestRequestDocumentStatus.DRAFT,
            // Corrected from PENDING to WAITING_APPROVAL_LAB based on schema
            labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
            projectId: project.id,
            notes: 'Please expedite this request',
        },
        {
            requestNo: 'STAR-20251031-001',
            requesterName: 'Jane Smith',
            objective: 'Research sample analysis',
            documentStatus: TestRequestDocumentStatus.SUBMITTED,
            labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
            projectId: project.id,
        },
        {
            requestNo: 'STAR-20251030-002',
            requesterName: 'Bob Johnson',
            objective: 'Routine health screening',
            documentStatus: TestRequestDocumentStatus.PENDING_PAYMENT,
            labInternalStatus: LabInternalStatus.COMPLETED,
            projectId: project.id,
        },
        {
            requestNo: 'STAR-20251029-001',
            requesterName: 'Alice Williams',
            objective: 'Clinical trial samples',
            documentStatus: TestRequestDocumentStatus.APPROVED,
            labInternalStatus: LabInternalStatus.COMPLETED,
        },
        {
            requestNo: 'STAR-20251028-003',
            requesterName: 'Charlie Brown',
            objective: 'Environmental testing',
            notes: 'Samples received in poor condition',
            documentStatus: TestRequestDocumentStatus.REJECTED,
            // Corrected from CANCELLED to HOLD based on schema
            labInternalStatus: LabInternalStatus.HOLD,
        },
    ];

    for (const data of requestsData) {
        const request = await prisma.testRequest.create({
            data: {
                customerId: customer.id,
                ...data,
            },
        });
        testRequests.push(request);
        globalThis.console.log(
            `📝 Created Test Request: ${request.requestNo} (${request.documentStatus})`
        );
    }

    // 5. Create samples for requests
    const samples: TestRequestSample[] = [];

    // Sample for Request 1 (DRAFT)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[0].id,
                customerSampleId: 'SAMP-2025-001',
                sentSampleDate: new Date('2025-11-01'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Complete Blood Count',
                method: 'Automated Analyzer',
                requestedQty: 2,
                unit: 'tubes',
                // Corrected from PENDING to RECEIVED based on schema
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    // Sample for Request 2 (SUBMITTED)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[1].id,
                customerSampleId: 'SAMP-2025-002',
                sentSampleDate: new Date('2025-10-31'),
                animalType: 'Cat',
                sampleSpecimen: 'Serum',
                panel: 'Biochemistry Panel',
                method: 'ELISA',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'ml',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    // Another sample for Request 2
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[1].id,
                customerSampleId: 'SAMP-2025-003',
                sentSampleDate: new Date('2025-10-31'),
                animalType: 'Cat',
                sampleSpecimen: 'Tissue',
                panel: 'Histopathology',
                method: 'Microscopy',
                requestedQty: 3,
                receivedQty: 3,
                unit: 'slides',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );
    globalThis.console.log(`🧪 Created ${samples.length} samples.`);

    const labTestRequest = testRequests[1]; // Use SUBMITTED request for invoice
    const labSample = samples[1]; // Use first sample of SUBMITTED request

    // 6. Create lab test
    const labTest = await prisma.labTest.create({
        data: {
            testRequestSampleId: labSample.id,
            caseNo: 'CASE-001',
            caseDate: new Date(),
            testPanel: 'Complete Blood Count',
            testMethod: 'Spectrophotometry',
            labResultStatus: LabResultStatus.PENDING,
        },
    });
    globalThis.console.log(`🔬 Created Lab Test: ${labTest.caseNo}`);

    // 7. Create lab result
    await prisma.labResult.create({
        data: {
            labTestId: labTest.id,
            parameter: 'Hemoglobin',
            value: '13.5',
            unit: 'g/dL',
            referenceRange: '12-16',
            isAbnormal: false,
            notes: 'Within normal range',
        },
    });
    globalThis.console.log(`📊 Created Lab Result for ${labTest.testPanel}`);

    // 8. Create invoice
    const invoice = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-001',
            testRequestId: labTestRequest.id,
            customerId: customer.id,
            subTotal: 500.0,
            taxAmount: 35.0,
            netTotal: 535.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
        },
    });
    globalThis.console.log(
        `💵 Created Invoice: ${invoice.invoiceNo} (${invoice.paymentStatus})`
    );

    // 9. Create invoice line item
    await prisma.invoiceLineItem.create({
        data: {
            invoiceId: invoice.id,
            description: 'CBC Test',
            quantity: 1,
            unitPrice: 500.0,
            lineTotal: 500.0,
        },
    });

    globalThis.console.log('✅ Full mock dataset seeded successfully.');
}

main()
    .catch((e) => {
        globalThis.console.error('An error occurred during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        globalThis.console.log('Database client disconnected.');
    });
