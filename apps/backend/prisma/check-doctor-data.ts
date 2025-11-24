import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Get doctor user
    const doctorUser = await prisma.user.findFirst({
        where: { email: 'doctor@starlab.com' },
    });
    console.log('Doctor User:', doctorUser);

    // Get doctor record
    const doctor = await prisma.doctor.findFirst({
        where: { userId: doctorUser?.id },
    });
    console.log('\nDoctor Record:', doctor);

    // Get test requests with RESULT_READY status
    const requests = await prisma.testRequest.findMany({
        where: {
            documentStatus: 'RESULT_READY',
        },
        select: {
            id: true,
            requestNo: true,
            documentStatus: true,
            doctorId: true,
        },
    });
    console.log('\nRESULT_READY Test Requests:', requests);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
