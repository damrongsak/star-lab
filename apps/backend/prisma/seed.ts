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
        { email: 'doctor@starlab.com', role: UserRole.DOCTOR },
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

    // Get the doctor user for assignment
    const doctorUser = userRecords[UserRole.DOCTOR];
    if (!doctorUser) {
        throw new Error('Doctor user failed to be created/retrieved.');
    }

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
        // Add test requests for doctor approval workflow
        {
            requestNo: 'STAR-20251118-001',
            requesterName: 'Dr. Test Subject 1',
            objective: 'Clinical blood work analysis',
            documentStatus: TestRequestDocumentStatus.RESULT_READY,
            labInternalStatus: LabInternalStatus.COMPLETED,
            projectId: project.id,
            doctorId: doctorUser.id,
            notes: 'Ready for doctor approval',
        },
        {
            requestNo: 'STAR-20251118-002',
            requesterName: 'Dr. Test Subject 2',
            objective: 'Pathology specimen review',
            documentStatus: TestRequestDocumentStatus.RESULT_READY,
            labInternalStatus: LabInternalStatus.COMPLETED,
            projectId: project.id,
            doctorId: doctorUser.id,
            notes: 'Urgent - needs immediate review',
        },
        {
            requestNo: 'STAR-20251118-003',
            requesterName: 'Dr. Test Subject 3',
            objective: 'Microbiology culture results',
            documentStatus: TestRequestDocumentStatus.RESULT_READY,
            labInternalStatus: LabInternalStatus.COMPLETED,
            projectId: project.id,
            doctorId: doctorUser.id,
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

    // Samples for RESULT_READY requests (for doctor approval workflow)
    // Sample for Request 6 (RESULT_READY - STAR-20251118-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[5].id,
                customerSampleId: 'SAMP-2025-101',
                sentSampleDate: new Date('2025-11-17'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Complete Blood Count',
                method: 'Automated Analyzer',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'tubes',
                currentStatus: TestRequestSampleStatus.COMPLETED,
            },
        })
    );

    // Sample for Request 7 (RESULT_READY - STAR-20251118-002)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[6].id,
                customerSampleId: 'SAMP-2025-102',
                sentSampleDate: new Date('2025-11-17'),
                animalType: 'Cat',
                sampleSpecimen: 'Tissue',
                panel: 'Histopathology',
                method: 'Microscopy',
                requestedQty: 2,
                receivedQty: 2,
                unit: 'slides',
                currentStatus: TestRequestSampleStatus.COMPLETED,
            },
        })
    );

    // Sample for Request 8 (RESULT_READY - STAR-20251118-003)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequests[7].id,
                customerSampleId: 'SAMP-2025-103',
                sentSampleDate: new Date('2025-11-17'),
                animalType: 'Dog',
                sampleSpecimen: 'Swab',
                panel: 'Microbiology Culture',
                method: 'Culture & Sensitivity',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'swabs',
                currentStatus: TestRequestSampleStatus.COMPLETED,
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

    // Create lab tests and results for RESULT_READY requests (doctor approval workflow)
    // Lab Test 1 for SAMP-2025-101 (Complete Blood Count)
    const labTest1 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[3].id, // SAMP-2025-101
            caseNo: 'CASE-101',
            caseDate: new Date('2025-11-17'),
            testPanel: 'Complete Blood Count',
            testMethod: 'Automated Analyzer',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest1.id,
                parameter: 'Hemoglobin',
                value: '14.2',
                unit: 'g/dL',
                referenceRange: '12-16',
                isAbnormal: false,
            },
            {
                labTestId: labTest1.id,
                parameter: 'White Blood Cell Count',
                value: '8.5',
                unit: '10^3/µL',
                referenceRange: '4.5-11',
                isAbnormal: false,
            },
            {
                labTestId: labTest1.id,
                parameter: 'Platelet Count',
                value: '275',
                unit: '10^3/µL',
                referenceRange: '150-400',
                isAbnormal: false,
            },
        ],
    });
    globalThis.console.log(`🔬 Created Lab Test: ${labTest1.caseNo} with 3 results`);

    // Lab Test 2 for SAMP-2025-102 (Histopathology)
    const labTest2 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[4].id, // SAMP-2025-102
            caseNo: 'CASE-102',
            caseDate: new Date('2025-11-17'),
            testPanel: 'Histopathology',
            testMethod: 'Microscopy',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.create({
        data: {
            labTestId: labTest2.id,
            parameter: 'Tissue Analysis',
            value: 'No malignant cells detected',
            unit: 'descriptive',
            referenceRange: 'Normal tissue architecture',
            isAbnormal: false,
            notes: 'Benign inflammatory changes observed. No evidence of neoplasia.',
        },
    });
    globalThis.console.log(`🔬 Created Lab Test: ${labTest2.caseNo} with 1 result`);

    // Lab Test 3 for SAMP-2025-103 (Microbiology Culture)
    const labTest3 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[5].id, // SAMP-2025-103
            caseNo: 'CASE-103',
            caseDate: new Date('2025-11-17'),
            testPanel: 'Microbiology Culture',
            testMethod: 'Culture & Sensitivity',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest3.id,
                parameter: 'Bacterial Culture',
                value: 'Staphylococcus aureus detected',
                unit: 'descriptive',
                referenceRange: 'No growth',
                isAbnormal: true,
                notes: 'Heavy growth of S. aureus',
            },
            {
                labTestId: labTest3.id,
                parameter: 'Antibiotic Sensitivity',
                value: 'Sensitive to Amoxicillin, Cephalexin',
                unit: 'descriptive',
                referenceRange: 'Varies',
                isAbnormal: false,
                notes: 'Resistant to Penicillin',
            },
        ],
    });
    globalThis.console.log(`🔬 Created Lab Test: ${labTest3.caseNo} with 2 results`);

    // 8. Create multiple invoices with different statuses
    const invoicesData = [
        {
            invoiceNo: 'INV-2025-001',
            testRequestId: testRequests[1].id, // SUBMITTED request
            customerId: customer.id,
            invoiceDate: new Date('2025-11-01'),
            dueDate: new Date('2025-11-15'),
            subTotal: 1500.0,
            taxRate: 0.07,
            taxAmount: 105.0,
            netTotal: 1605.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
            lineItems: [
                { description: 'Complete Blood Count Test', quantity: 1, unitPrice: 800.0, lineTotal: 800.0 },
                { description: 'Biochemistry Panel', quantity: 1, unitPrice: 700.0, lineTotal: 700.0 },
            ],
        },
        {
            invoiceNo: 'INV-2025-002',
            testRequestId: testRequests[2].id, // PENDING_PAYMENT request
            customerId: customer.id,
            invoiceDate: new Date('2025-10-30'),
            dueDate: new Date('2025-11-13'),
            subTotal: 2500.0,
            taxRate: 0.07,
            taxAmount: 175.0,
            netTotal: 2675.0,
            paymentStatus: InvoicePaymentStatus.PAID,
            paymentSlipAttachmentUrl: '/uploads/payment-slips/slip-001.pdf',
            lineItems: [
                { description: 'Histopathology Analysis', quantity: 2, unitPrice: 1000.0, lineTotal: 2000.0 },
                { description: 'Microbiology Culture', quantity: 1, unitPrice: 500.0, lineTotal: 500.0 },
            ],
        },
        {
            invoiceNo: 'INV-2025-003',
            testRequestId: testRequests[3].id, // APPROVED request
            customerId: customer.id,
            invoiceDate: new Date('2025-10-29'),
            dueDate: new Date('2025-11-12'),
            subTotal: 800.0,
            taxRate: 0.07,
            taxAmount: 56.0,
            netTotal: 856.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
            lineItems: [
                { description: 'Basic Chemistry Panel', quantity: 1, unitPrice: 800.0, lineTotal: 800.0 },
            ],
        },
        {
            invoiceNo: 'INV-2025-004',
            testRequestId: testRequests[1].id,
            customerId: customer.id,
            invoiceDate: new Date('2025-10-15'),
            dueDate: new Date('2025-10-29'),
            subTotal: 1200.0,
            taxRate: 0.07,
            taxAmount: 84.0,
            netTotal: 1284.0,
            paymentStatus: InvoicePaymentStatus.OVERDUE,
            lineItems: [
                { description: 'Serology Test', quantity: 2, unitPrice: 600.0, lineTotal: 1200.0 },
            ],
        },
        {
            invoiceNo: 'INV-2025-005',
            testRequestId: testRequests[2].id,
            customerId: customer.id,
            invoiceDate: new Date('2025-10-25'),
            dueDate: new Date('2025-11-08'),
            subTotal: 3000.0,
            taxRate: 0.07,
            taxAmount: 210.0,
            netTotal: 3210.0,
            paymentStatus: InvoicePaymentStatus.PAID,
            paymentSlipAttachmentUrl: '/uploads/payment-slips/slip-002.pdf',
            lineItems: [
                { description: 'Comprehensive Metabolic Panel', quantity: 1, unitPrice: 1500.0, lineTotal: 1500.0 },
                { description: 'Urinalysis Complete', quantity: 1, unitPrice: 500.0, lineTotal: 500.0 },
                { description: 'Lipid Panel', quantity: 1, unitPrice: 1000.0, lineTotal: 1000.0 },
            ],
        },
    ];

    for (const invoiceData of invoicesData) {
        const { lineItems, ...invoiceFields } = invoiceData;

        const invoice = await prisma.invoice.create({
            data: invoiceFields,
        });

        globalThis.console.log(
            `💵 Created Invoice: ${invoice.invoiceNo} (${invoice.paymentStatus})`
        );

        // Create invoice line items
        for (const item of lineItems) {
            await prisma.invoiceLineItem.create({
                data: {
                    invoiceId: invoice.id,
                    ...item,
                },
            });
        }

        globalThis.console.log(`   📋 Created ${lineItems.length} line item(s) for ${invoice.invoiceNo}`);
    }

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
