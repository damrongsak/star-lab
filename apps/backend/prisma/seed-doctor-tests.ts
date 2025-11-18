import {
    PrismaClient,
    TestRequestDocumentStatus,
    LabInternalStatus,
    TestRequestSampleStatus,
    LabResultStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding test requests for doctor approval workflow...');

    // Get the doctor user
    const doctorUser = await prisma.user.findFirst({
        where: { email: 'doctor@starlab.com' },
    });

    if (!doctorUser) {
        throw new Error('Doctor user not found. Please run the main seed first.');
    }

    // Create or find doctor record
    const doctor = await prisma.doctor.upsert({
        where: { userId: doctorUser.id },
        update: {},
        create: {
            userId: doctorUser.id,
            licenseNumber: 'DR-12345',
            specialization: 'Laboratory Medicine',
            qualifications: 'MD, PhD in Laboratory Medicine',
            isActive: true,
        },
    });

    console.log(`✅ Doctor profile: ${doctor.licenseNumber}`);

    // Get a customer
    const customer = await prisma.customer.findFirst();
    if (!customer) {
        throw new Error('Customer not found. Please run the main seed first.');
    }

    // Get a project
    const project = await prisma.project.findFirst();
    if (!project) {
        throw new Error('Project not found. Please run the main seed first.');
    }

    // Create 3 test requests with RESULT_READY status
    const requests = [
        {
            requestNo: 'STAR-20251118-001',
            requesterName: 'Dr. Test Subject 1',
            objective: 'Clinical blood work analysis',
            notes: 'Ready for doctor approval',
        },
        {
            requestNo: 'STAR-20251118-002',
            requesterName: 'Dr. Test Subject 2',
            objective: 'Pathology specimen review',
            notes: 'Urgent - needs immediate review',
        },
        {
            requestNo: 'STAR-20251118-003',
            requesterName: 'Dr. Test Subject 3',
            objective: 'Microbiology culture results',
        },
    ];

    for (const reqData of requests) {
        // Create test request
        const testRequest = await prisma.testRequest.upsert({
            where: { requestNo: reqData.requestNo },
            update: {},
            create: {
                ...reqData,
                customerId: customer.id,
                documentStatus: TestRequestDocumentStatus.RESULT_READY,
                labInternalStatus: LabInternalStatus.COMPLETED,
                projectId: project.id,
                doctorId: doctor.id,
            },
        });

        console.log(`✅ Created test request: ${testRequest.requestNo}`);

        // Create sample for the request
        const sample = await prisma.testRequestSample.create({
            data: {
                testRequestId: testRequest.id,
                customerSampleId: `SAMP-${reqData.requestNo}`,
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
        });

        console.log(`   🧪 Created sample: ${sample.customerSampleId}`);

        // Create lab test for the sample
        const labTest = await prisma.labTest.create({
            data: {
                testRequestSampleId: sample.id,
                caseNo: `CASE-${reqData.requestNo}`,
                caseDate: new Date('2025-11-17'),
                testPanel: 'Complete Blood Count',
                testMethod: 'Automated Analyzer',
                labResultStatus: LabResultStatus.COMPLETED,
            },
        });

        // Create lab results
        await prisma.labResult.createMany({
            data: [
                {
                    labTestId: labTest.id,
                    parameter: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    referenceRange: '12-16',
                    isAbnormal: false,
                },
                {
                    labTestId: labTest.id,
                    parameter: 'White Blood Cell Count',
                    value: '8.5',
                    unit: '10^3/µL',
                    referenceRange: '4.5-11',
                    isAbnormal: false,
                },
            ],
        });

        console.log(`   🔬 Created lab test: ${labTest.caseNo} with results`);
    }

    console.log('\n✅ Successfully added 3 test requests ready for doctor approval!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
