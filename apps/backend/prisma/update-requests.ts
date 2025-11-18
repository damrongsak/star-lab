import { PrismaClient, TestRequestDocumentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Get doctor record
    const doctor = await prisma.doctor.findFirst({
        where: { licenseNumber: 'DR-12345' },
    });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    console.log(`Doctor ID: ${doctor.id}`);

    // Update the 3 test requests to RESULT_READY and assign to doctor
    const requestNos = ['STAR-20251118-001', 'STAR-20251118-002', 'STAR-20251118-003'];

    for (const requestNo of requestNos) {
        const updated = await prisma.testRequest.updateMany({
            where: { requestNo },
            data: {
                documentStatus: TestRequestDocumentStatus.RESULT_READY,
                doctorId: doctor.id,
            },
        });
        console.log(`✅ Updated ${requestNo}:`, updated.count, 'records');
    }

    // Verify
    const requests = await prisma.testRequest.findMany({
        where: {
            doctorId: doctor.id,
            documentStatus: TestRequestDocumentStatus.RESULT_READY,
        },
        select: {
            requestNo: true,
            documentStatus: true,
            doctorId: true,
        },
    });

    console.log('\nVerification - RESULT_READY requests assigned to doctor:');
    console.log(requests);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
