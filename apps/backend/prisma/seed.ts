import {
    PrismaClient,
    UserRole,
    InvoicePaymentStatus,
    TestRequestDocumentStatus,
    LabInternalStatus,
    LabResultStatus,
    TestRequestSampleStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import process from 'process';

const prisma = new PrismaClient();

/**
 * Comprehensive seed data for STAR-LAB system
 * Supports full user role test flows for all 6 roles:
 * - CUSTOMER (2 users, 2 companies)
 * - TECHNICIAN (3 users)
 * - DOCTOR (2 users)
 * - LAB_ADMIN (1 user)
 * - ADMIN (1 user)
 * - APPROVAL (1 user)
 */

async function main() {
    console.log('🌱 Starting comprehensive seed process...');
    console.log('');

    // ============================================================================
    // 0. CLEANUP EXISTING DATA (for idempotent seeding)
    // ============================================================================
    console.log('🧹 Cleaning up existing test data...');

    // Delete in reverse order of dependencies (only tables used by seed)
    await prisma.labResult.deleteMany({});
    console.log('   ✅ Deleted lab results');

    await prisma.labTest.deleteMany({});
    console.log('   ✅ Deleted lab tests');

    await prisma.testRequestSample.deleteMany({});
    console.log('   ✅ Deleted test request samples');

    await prisma.invoice.deleteMany({});
    console.log('   ✅ Deleted invoices');

    await prisma.testRequest.deleteMany({});
    console.log('   ✅ Deleted test requests');

    await prisma.requestSequence.deleteMany({});
    console.log('   ✅ Deleted request sequences');

    await prisma.project.deleteMany({});
    console.log('   ✅ Deleted projects');

    await prisma.doctor.deleteMany({});
    console.log('   ✅ Deleted doctor profiles');

    await prisma.customer.deleteMany({});
    console.log('   ✅ Deleted customers');

    await prisma.userProfile.deleteMany({});
    console.log('   ✅ Deleted user profiles');

    // Delete audit trail before users (foreign key constraint)
    await prisma.auditTrail.deleteMany({});
    console.log('   ✅ Deleted audit trails');

    await prisma.user.deleteMany({});
    console.log('   ✅ Deleted users');

    console.log('');

    // ============================================================================
    // 1. CREATE USERS FOR ALL ROLES
    // ============================================================================
    console.log('👥 Creating users for all roles...');

    const password = await bcrypt.hash('password', 10);

    // ADMIN User
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@starlab.com' },
        update: {},
        create: {
            email: 'admin@starlab.com',
            role: UserRole.ADMIN,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Admin: ${adminUser.email}`);

    // LAB_ADMIN User
    const labAdminUser = await prisma.user.upsert({
        where: { email: 'labadmin@starlab.com' },
        update: {},
        create: {
            email: 'labadmin@starlab.com',
            role: UserRole.LAB_ADMIN,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Lab Admin: ${labAdminUser.email}`);

    // CUSTOMER Users (2)
    const customer1User = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            role: UserRole.CUSTOMER,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Customer 1: ${customer1User.email}`);

    const customer2User = await prisma.user.upsert({
        where: { email: 'customer2@example.com' },
        update: {},
        create: {
            email: 'customer2@example.com',
            role: UserRole.CUSTOMER,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Customer 2: ${customer2User.email}`);

    // TECHNICIAN Users (3)
    const tech1User = await prisma.user.upsert({
        where: { email: 'tech@starlab.com' },
        update: {},
        create: {
            email: 'tech@starlab.com',
            role: UserRole.TECHNICIAN,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Technician 1: ${tech1User.email}`);

    const tech2User = await prisma.user.upsert({
        where: { email: 'tech2@starlab.com' },
        update: {},
        create: {
            email: 'tech2@starlab.com',
            role: UserRole.TECHNICIAN,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Technician 2: ${tech2User.email}`);

    const tech3User = await prisma.user.upsert({
        where: { email: 'tech3@starlab.com' },
        update: {},
        create: {
            email: 'tech3@starlab.com',
            role: UserRole.TECHNICIAN,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Technician 3: ${tech3User.email}`);

    // DOCTOR Users (2)
    const doctor1User = await prisma.user.upsert({
        where: { email: 'doctor@starlab.com' },
        update: {},
        create: {
            email: 'doctor@starlab.com',
            role: UserRole.DOCTOR,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Doctor 1: ${doctor1User.email}`);

    const doctor2User = await prisma.user.upsert({
        where: { email: 'doctor2@starlab.com' },
        update: {},
        create: {
            email: 'doctor2@starlab.com',
            role: UserRole.DOCTOR,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Doctor 2: ${doctor2User.email}`);

    // APPROVAL User
    const approvalUser = await prisma.user.upsert({
        where: { email: 'approval@starlab.com' },
        update: {},
        create: {
            email: 'approval@starlab.com',
            role: UserRole.APPROVAL,
            passwordHash: password,
            isEmailConfirmed: true,
        },
    });
    console.log(`   ✅ Approval: ${approvalUser.email}`);

    console.log('');

    // ============================================================================
    // 2. CREATE USER PROFILES (for non-customer users)
    // ============================================================================
    console.log('📋 Creating user profiles for internal staff...');

    const profiles = [
        { userId: adminUser.id, firstName: 'Admin', lastName: 'User', phoneNumber: '02-111-1111' },
        { userId: labAdminUser.id, firstName: 'Lab', lastName: 'Administrator', phoneNumber: '02-222-2222' },
        { userId: tech1User.id, firstName: 'John', lastName: 'Technician', phoneNumber: '081-111-1111' },
        { userId: tech2User.id, firstName: 'Jane', lastName: 'Technician', phoneNumber: '081-222-2222' },
        { userId: tech3User.id, firstName: 'Bob', lastName: 'Technician', phoneNumber: '081-333-3333' },
        { userId: doctor1User.id, firstName: 'Dr. Sarah', lastName: 'Smith', phoneNumber: '082-111-1111' },
        { userId: doctor2User.id, firstName: 'Dr. Michael', lastName: 'Johnson', phoneNumber: '082-222-2222' },
        { userId: approvalUser.id, firstName: 'Approval', lastName: 'Officer', phoneNumber: '02-333-3333' },
    ];

    for (const profile of profiles) {
        await prisma.userProfile.upsert({
            where: { userId: profile.userId },
            update: {},
            create: profile,
        });
        console.log(`   ✅ Profile for ${profile.firstName} ${profile.lastName}`);
    }

    console.log('');

    // ============================================================================
    // 3. CREATE DOCTOR PROFILES
    // ============================================================================
    console.log('👨‍⚕️ Creating doctor profiles...');

    const doctor1 = await prisma.doctor.upsert({
        where: { userId: doctor1User.id },
        update: {},
        create: {
            userId: doctor1User.id,
            licenseNumber: 'MD-2024-001',
            specialization: 'Veterinary Pathology',
            qualifications: 'DVM, PhD in Veterinary Pathology',
            isActive: true,
        },
    });
    console.log(`   ✅ Doctor profile for Dr. Sarah Smith`);

    const doctor2 = await prisma.doctor.upsert({
        where: { userId: doctor2User.id },
        update: {},
        create: {
            userId: doctor2User.id,
            licenseNumber: 'MD-2024-002',
            specialization: 'Clinical Microbiology',
            qualifications: 'DVM, Board Certified in Microbiology',
            isActive: true,
        },
    });
    console.log(`   ✅ Doctor profile for Dr. Michael Johnson`);

    console.log('');

    // ============================================================================
    // 4. CREATE COMPANIES (CUSTOMERS)
    // ============================================================================
    console.log('🏢 Creating customer companies...');

    const customer1 = await prisma.customer.upsert({
        where: { userId: customer1User.id },
        update: {},
        create: {
            userId: customer1User.id,
            companyNameEn: 'ABC Company Ltd',
            companyNameTh: 'บริษัท เอบีซี จำกัด',
            legalEntityId: '0105123456789',
            companyDescription: 'Leading animal health research company',
            companyAddressLine1: '123 Sukhumvit Road, Klongtoey',
            companyProvince: 'Bangkok',
            companyDistrict: 'Klongtoey',
            companySubDistrict: 'Klongtoey',
            companyZipCode: '10110',
            companyPhone: '02-123-4567',
            companyFax: '02-123-4568',
            operatorIdCard: '1234567890123',
            operatorPrefix: 'Mr.',
            operatorFirstName: 'John',
            operatorLastName: 'Doe',
            operatorMobilePhone: '081-234-5678',
            operatorPhone: '02-123-4567',
            receiptAddressBuildingFloorNumber: '123 Sukhumvit Rd, 5th Floor',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Klongtoey',
            receiptSubDistrict: 'Klongtoey',
            receiptZipCode: '10110',
            receiptPhone: '02-123-4567',
        },
    });
    console.log(`   ✅ ${customer1.companyNameEn} (Company Code: ABC)`);

    const customer2 = await prisma.customer.upsert({
        where: { userId: customer2User.id },
        update: {},
        create: {
            userId: customer2User.id,
            companyNameEn: 'XYZ Corporation',
            companyNameTh: 'บริษัท เอ็กซ์วายแซด จำกัด',
            legalEntityId: '0205987654321',
            companyDescription: 'Veterinary clinic network',
            companyAddressLine1: '456 Rama IV Road, Pathumwan',
            companyProvince: 'Bangkok',
            companyDistrict: 'Pathumwan',
            companySubDistrict: 'Wangmai',
            companyZipCode: '10330',
            companyPhone: '02-987-6543',
            companyFax: '02-987-6544',
            operatorIdCard: '9876543210987',
            operatorPrefix: 'Ms.',
            operatorFirstName: 'Jane',
            operatorLastName: 'Smith',
            operatorMobilePhone: '082-987-6543',
            operatorPhone: '02-987-6543',
            receiptAddressBuildingFloorNumber: '456 Rama IV Rd, 10th Floor',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Pathumwan',
            receiptSubDistrict: 'Wangmai',
            receiptZipCode: '10330',
            receiptPhone: '02-987-6543',
        },
    });
    console.log(`   ✅ ${customer2.companyNameEn} (Company Code: XYZ)`);

    console.log('');

    // ============================================================================
    // 5. CREATE REQUEST SEQUENCES
    // ============================================================================
    console.log('🔢 Creating request sequences...');

    await prisma.requestSequence.upsert({
        where: { companyCode_date: { companyCode: 'ABC', date: '20251128' } },
        update: { sequence: 5 },
        create: {
            companyCode: 'ABC',
            date: '20251128',
            sequence: 5,
        },
    });
    console.log(`   ✅ Request sequence for ABC (20251128): 5`);

    await prisma.requestSequence.upsert({
        where: { companyCode_date: { companyCode: 'XYZ', date: '20251128' } },
        update: { sequence: 3 },
        create: {
            companyCode: 'XYZ',
            date: '20251128',
            sequence: 3,
        },
    });
    console.log(`   ✅ Request sequence for XYZ (20251128): 3`);

    console.log('');

    // ============================================================================
    // 6. CREATE PROJECTS
    // ============================================================================
    console.log('📁 Creating projects...');

    const project1 = await prisma.project.upsert({
        where: {
            customerId_projectCode: {
                customerId: customer1.id,
                projectCode: 'ABC-CANINE-2025',
            },
        },
        update: {
            description: 'Research project on canine health markers',
            customerId: customer1.id,
            projectCode: 'ABC-CANINE-2025',
            createdById: customer1User.id,
        },
        create: {
            projectCode: 'ABC-CANINE-2025',
            name: 'Canine Health Study 2025',
            description: 'Research project on canine health markers',
            customerId: customer1.id,
            createdById: customer1User.id,
        },
    });
    console.log(`   ✅ ${project1.name}`);

    const project2 = await prisma.project.upsert({
        where: {
            customerId_projectCode: {
                customerId: customer2.id,
                projectCode: 'XYZ-FELINE-2025',
            },
        },
        update: {
            description: 'Study on common feline diseases',
            customerId: customer2.id,
            projectCode: 'XYZ-FELINE-2025',
            createdById: customer2User.id,
        },
        create: {
            projectCode: 'XYZ-FELINE-2025',
            name: 'Feline Disease Research',
            description: 'Study on common feline diseases',
            customerId: customer2.id,
            createdById: customer2User.id,
        },
    });
    console.log(`   ✅ ${project2.name}`);

    console.log('');

    // ============================================================================
    // 7. CREATE TEST REQUESTS (Various Statuses)
    // ============================================================================
    console.log('📝 Creating test requests in various statuses...');

    const requests = [];

    // === DRAFT Requests (2) ===
    console.log('   📄 Creating DRAFT requests (editable)...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251128-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Routine health screening for breeding dogs',
                documentStatus: TestRequestDocumentStatus.DRAFT,
                labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
                projectId: project1.id,
                notes: 'Please expedite if possible',
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251128-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Pre-surgery blood work',
                documentStatus: TestRequestDocumentStatus.DRAFT,
                labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
                notes: 'Patient scheduled for surgery next week',
            },
        })
    );
    console.log(`      ✅ 2 DRAFT requests created`);

    // === SUBMITTED Requests (3) ===
    console.log('   📤 Creating SUBMITTED requests (awaiting lab)...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251127-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Comprehensive metabolic panel',
                documentStatus: TestRequestDocumentStatus.SUBMITTED,
                labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
                projectId: project1.id,
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251127-002',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Microbiology culture and sensitivity',
                documentStatus: TestRequestDocumentStatus.SUBMITTED,
                labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
                notes: 'Suspected bacterial infection',
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251127-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Histopathology examination',
                documentStatus: TestRequestDocumentStatus.SUBMITTED,
                labInternalStatus: LabInternalStatus.WAITING_APPROVAL_LAB,
                projectId: project2.id,
            },
        })
    );
    console.log(`      ✅ 3 SUBMITTED requests created`);

    // === RECEIVED_SAMPLES (2) ===
    console.log('   📦 Creating RECEIVED_SAMPLES requests (in processing)...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251126-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Complete blood count analysis',
                documentStatus: TestRequestDocumentStatus.SUBMITTED,
                labInternalStatus: LabInternalStatus.RECEIVED_SAMPLES,
                projectId: project1.id,
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251126-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Chemistry panel and urinalysis',
                documentStatus: TestRequestDocumentStatus.SUBMITTED,
                labInternalStatus: LabInternalStatus.RECEIVED_SAMPLES,
            },
        })
    );
    console.log(`      ✅ 2 RECEIVED_SAMPLES requests created`);

    // === RESULT_READY (3) - Awaiting Doctor Approval ===
    console.log('   ⏳ Creating RESULT_READY requests (awaiting doctor approval)...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251125-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Complete blood work with differential',
                documentStatus: TestRequestDocumentStatus.RESULT_READY,
                labInternalStatus: LabInternalStatus.READY_FOR_APPROVAL,
                projectId: project1.id,
                doctorId: doctor1.id,
                notes: 'Ready for Dr. Smith review',
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251125-002',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Tissue biopsy pathology',
                documentStatus: TestRequestDocumentStatus.RESULT_READY,
                labInternalStatus: LabInternalStatus.READY_FOR_APPROVAL,
                doctorId: doctor1.id,
                notes: 'Urgent - suspected malignancy',
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251125-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Bacterial culture identification',
                documentStatus: TestRequestDocumentStatus.RESULT_READY,
                labInternalStatus: LabInternalStatus.READY_FOR_APPROVAL,
                projectId: project2.id,
                doctorId: doctor2.id,
            },
        })
    );
    console.log(`      ✅ 3 RESULT_READY requests created`);

    // === APPROVED Requests (3) ===
    console.log('   ✅ Creating APPROVED requests (completed)...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251120-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Routine wellness panel',
                documentStatus: TestRequestDocumentStatus.APPROVED,
                labInternalStatus: LabInternalStatus.COMPLETED,
                projectId: project1.id,
                doctorId: doctor1.id,
                approvedById: doctor1User.id,
                approvedAt: new Date('2025-11-21T10:30:00Z'),
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251118-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Pre-breeding health screening',
                documentStatus: TestRequestDocumentStatus.APPROVED,
                labInternalStatus: LabInternalStatus.COMPLETED,
                doctorId: doctor2.id,
                approvedById: doctor2User.id,
                approvedAt: new Date('2025-11-19T14:15:00Z'),
            },
        })
    );

    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251115-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Post-treatment monitoring',
                documentStatus: TestRequestDocumentStatus.APPROVED,
                labInternalStatus: LabInternalStatus.COMPLETED,
                projectId: project2.id,
                doctorId: doctor1.id,
                approvedById: doctor1User.id,
                approvedAt: new Date('2025-11-16T09:00:00Z'),
            },
        })
    );
    console.log(`      ✅ 3 APPROVED requests created`);

    // === REJECTED Request (1) ===
    console.log('   ❌ Creating REJECTED request...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'ABC-20251110-001',
                customerId: customer1.id,
                requesterName: 'John Doe',
                objective: 'Blood chemistry panel',
                documentStatus: TestRequestDocumentStatus.REJECTED,
                labInternalStatus: LabInternalStatus.HOLD,
                doctorId: doctor1.id,
                rejectedAt: new Date('2025-11-12T16:45:00Z'),
                rejectionReason:
                    'Sample quality insufficient for accurate testing. Hemolyzed specimen detected. Please resubmit with fresh samples collected using proper anticoagulant tubes.',
                notes: 'Customer notified to resubmit',
            },
        })
    );
    console.log(`      ✅ 1 REJECTED request created`);

    // === CANCELLED Request (1) ===
    console.log('   🚫 Creating CANCELLED request...');
    requests.push(
        await prisma.testRequest.create({
            data: {
                requestNo: 'XYZ-20251105-001',
                customerId: customer2.id,
                requesterName: 'Jane Smith',
                objective: 'Annual health screening',
                documentStatus: TestRequestDocumentStatus.CANCELLED,
                labInternalStatus: LabInternalStatus.HOLD,
                notes: 'Customer cancelled - patient deceased',
            },
        })
    );
    console.log(`      ✅ 1 CANCELLED request created`);

    console.log(`   📊 Total: ${requests.length} test requests created`);
    console.log('');

    // ============================================================================
    // 8. CREATE SAMPLES FOR TEST REQUESTS
    // ============================================================================
    console.log('🧪 Creating samples for test requests...');

    const samples = [];

    // Samples for DRAFT request 1 (ABC-20251128-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[0].id,
                customerSampleId: 'DOG-001-A',
                sentSampleDate: new Date('2025-11-28'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Complete Blood Count (CBC)',
                method: 'Automated Hematology Analyzer',
                requestedQty: 3,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.RECEIVED,
                notes: 'EDTA tube',
            },
        })
    );

    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[0].id,
                customerSampleId: 'DOG-001-B',
                sentSampleDate: new Date('2025-11-28'),
                animalType: 'Dog',
                sampleSpecimen: 'Serum',
                panel: 'Biochemistry Panel',
                method: 'Automated Chemistry Analyzer',
                requestedQty: 2,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    // Samples for DRAFT request 2 (XYZ-20251128-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[1].id,
                customerSampleId: 'CAT-002-A',
                sentSampleDate: new Date('2025-11-28'),
                animalType: 'Cat',
                sampleSpecimen: 'Blood',
                panel: 'Pre-anesthetic Panel',
                method: 'Point-of-Care Testing',
                requestedQty: 1,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    // Samples for SUBMITTED request 1 (ABC-20251127-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[2].id,
                customerSampleId: 'DOG-003-A',
                sentSampleDate: new Date('2025-11-27'),
                animalType: 'Dog',
                sampleSpecimen: 'Serum',
                panel: 'Comprehensive Metabolic Panel',
                method: 'Automated Chemistry Analyzer',
                requestedQty: 2,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[2].id,
                customerSampleId: 'DOG-003-B',
                sentSampleDate: new Date('2025-11-27'),
                animalType: 'Dog',
                sampleSpecimen: 'Urine',
                panel: 'Urinalysis Complete',
                method: 'Dipstick + Microscopy',
                requestedQty: 10,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.RECEIVED,
            },
        })
    );

    // Samples for SUBMITTED request 2 (ABC-20251127-002)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[3].id,
                customerSampleId: 'DOG-004-A',
                sentSampleDate: new Date('2025-11-27'),
                animalType: 'Dog',
                sampleSpecimen: 'Swab',
                panel: 'Bacterial Culture & Sensitivity',
                method: 'Culture on Agar Plates',
                requestedQty: 2,
                unit: 'swabs',
                currentStatus: TestRequestSampleStatus.RECEIVED,
                notes: 'Ear swab - suspected otitis',
            },
        })
    );

    // Samples for SUBMITTED request 3 (XYZ-20251127-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[4].id,
                customerSampleId: 'CAT-005-A',
                sentSampleDate: new Date('2025-11-27'),
                animalType: 'Cat',
                sampleSpecimen: 'Tissue',
                panel: 'Histopathology',
                method: 'H&E Staining + Microscopy',
                requestedQty: 1,
                unit: 'piece',
                currentStatus: TestRequestSampleStatus.RECEIVED,
                notes: 'Skin biopsy from abdomen',
            },
        })
    );

    // Samples for RECEIVED_SAMPLES request 1 (ABC-20251126-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[5].id,
                customerSampleId: 'DOG-006-A',
                sentSampleDate: new Date('2025-11-26'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Complete Blood Count',
                method: 'Automated Analyzer',
                requestedQty: 3,
                receivedQty: 2.5, // Quantity discrepancy
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.IN_TESTING,
                notes: 'Slight volume loss during transport',
            },
        })
    );

    // Samples for RECEIVED_SAMPLES request 2 (XYZ-20251126-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[6].id,
                customerSampleId: 'CAT-007-A',
                sentSampleDate: new Date('2025-11-26'),
                animalType: 'Cat',
                sampleSpecimen: 'Serum',
                panel: 'Biochemistry Panel',
                method: 'Automated Chemistry Analyzer',
                requestedQty: 2,
                receivedQty: 2,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.IN_TESTING,
            },
        })
    );

    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[6].id,
                customerSampleId: 'CAT-007-B',
                sentSampleDate: new Date('2025-11-26'),
                animalType: 'Cat',
                sampleSpecimen: 'Urine',
                panel: 'Urinalysis',
                method: 'Dipstick + Sediment Analysis',
                requestedQty: 5,
                receivedQty: 5,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.IN_TESTING,
            },
        })
    );

    // Samples for RESULT_READY request 1 (ABC-20251125-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[7].id,
                customerSampleId: 'DOG-008-A',
                sentSampleDate: new Date('2025-11-25'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'CBC with Differential',
                method: 'Automated Analyzer + Manual Count',
                requestedQty: 3,
                receivedQty: 3,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.CONSUMED,
            },
        })
    );

    // Samples for RESULT_READY request 2 (ABC-20251125-002)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[8].id,
                customerSampleId: 'DOG-009-A',
                sentSampleDate: new Date('2025-11-25'),
                animalType: 'Dog',
                sampleSpecimen: 'Tissue',
                panel: 'Histopathology with IHC',
                method: 'Microscopy + Immunohistochemistry',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'piece',
                currentStatus: TestRequestSampleStatus.CONSUMED,
                notes: 'Mammary mass biopsy',
            },
        })
    );

    // Samples for RESULT_READY request 3 (XYZ-20251125-001)
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[9].id,
                customerSampleId: 'CAT-010-A',
                sentSampleDate: new Date('2025-11-25'),
                animalType: 'Cat',
                sampleSpecimen: 'Swab',
                panel: 'Bacterial Culture',
                method: 'Culture & Identification',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'swab',
                currentStatus: TestRequestSampleStatus.CONSUMED,
                notes: 'Wound swab',
            },
        })
    );

    // Samples for APPROVED requests
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[10].id,
                customerSampleId: 'DOG-011-A',
                sentSampleDate: new Date('2025-11-20'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Wellness Panel',
                method: 'Automated Analyzer',
                requestedQty: 2,
                receivedQty: 2,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.CONSUMED,
            },
        })
    );

    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[11].id,
                customerSampleId: 'DOG-012-A',
                sentSampleDate: new Date('2025-11-18'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Pre-breeding Panel',
                method: 'Comprehensive Testing',
                requestedQty: 5,
                receivedQty: 5,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.CONSUMED,
            },
        })
    );

    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[12].id,
                customerSampleId: 'CAT-013-A',
                sentSampleDate: new Date('2025-11-15'),
                animalType: 'Cat',
                sampleSpecimen: 'Blood',
                panel: 'Monitoring Panel',
                method: 'Point-of-Care',
                requestedQty: 1,
                receivedQty: 1,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.CONSUMED,
            },
        })
    );

    // Samples for REJECTED request
    samples.push(
        await prisma.testRequestSample.create({
            data: {
                testRequestId: requests[13].id,
                customerSampleId: 'DOG-014-A',
                sentSampleDate: new Date('2025-11-10'),
                animalType: 'Dog',
                sampleSpecimen: 'Blood',
                panel: 'Chemistry Panel',
                method: 'Automated',
                requestedQty: 2,
                receivedQty: 2,
                unit: 'mL',
                currentStatus: TestRequestSampleStatus.REJECTED,
                notes: 'Hemolyzed - unsuitable for testing',
            },
        })
    );

    console.log(`   ✅ Created ${samples.length} samples`);
    console.log('');

    // ============================================================================
    // 9. CREATE LAB TESTS AND RESULTS
    // ============================================================================
    console.log('🔬 Creating lab tests and results...');

    // Lab Test for RECEIVED_SAMPLES (in progress)
    const labTest1 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[7].id, // DOG-006-A
            caseNo: 'CASE-20251126-001',
            caseDate: new Date('2025-11-26'),
            assignedLabTechnicianId: tech1User.id,
            testPanel: 'Complete Blood Count',
            testMethod: 'Automated Analyzer',
            labResultStatus: LabResultStatus.PARTIAL,
            notes: 'Testing in progress',
        },
    });

    // Add partial results
    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest1.id,
                parameter: 'WBC (White Blood Cells)',
                value: '8.2',
                unit: '10^3/μL',
                referenceRange: '6.0-17.0',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
            {
                labTestId: labTest1.id,
                parameter: 'RBC (Red Blood Cells)',
                value: '6.8',
                unit: '10^6/μL',
                referenceRange: '5.5-8.5',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
        ],
    });

    // Lab Tests for RESULT_READY requests (awaiting doctor approval)
    const labTest2 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[10].id, // DOG-008-A
            caseNo: 'CASE-20251125-001',
            caseDate: new Date('2025-11-25'),
            assignedLabTechnicianId: tech2User.id,
            testPanel: 'CBC with Differential',
            testMethod: 'Automated Analyzer + Manual Count',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest2.id,
                parameter: 'WBC',
                value: '12.5',
                unit: '10^3/μL',
                referenceRange: '6.0-17.0',
                isAbnormal: false,
                recordedById: tech2User.id,
            },
            {
                labTestId: labTest2.id,
                parameter: 'RBC',
                value: '5.2',
                unit: '10^6/μL',
                referenceRange: '5.5-8.5',
                isAbnormal: true,
                notes: 'Slightly below reference range',
                recordedById: tech2User.id,
            },
            {
                labTestId: labTest2.id,
                parameter: 'Hemoglobin',
                value: '13.8',
                unit: 'g/dL',
                referenceRange: '12.0-18.0',
                isAbnormal: false,
                recordedById: tech2User.id,
            },
            {
                labTestId: labTest2.id,
                parameter: 'Hematocrit',
                value: '42',
                unit: '%',
                referenceRange: '37-55',
                isAbnormal: false,
                recordedById: tech2User.id,
            },
            {
                labTestId: labTest2.id,
                parameter: 'Platelets',
                value: '285',
                unit: '10^3/μL',
                referenceRange: '150-400',
                isAbnormal: false,
                recordedById: tech2User.id,
            },
        ],
    });

    const labTest3 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[11].id, // DOG-009-A (Histopathology)
            caseNo: 'CASE-20251125-002',
            caseDate: new Date('2025-11-25'),
            assignedLabTechnicianId: tech1User.id,
            testPanel: 'Histopathology with IHC',
            testMethod: 'Microscopy + Immunohistochemistry',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.create({
        data: {
            labTestId: labTest3.id,
            parameter: 'Histopathological Diagnosis',
            value: 'Mammary gland adenocarcinoma, Grade II',
            unit: 'descriptive',
            referenceRange: 'No neoplastic cells',
            isAbnormal: true,
            notes:
                'Infiltrative growth pattern. Moderate nuclear pleomorphism. Mitotic figures present (8 per 10 HPF). IHC: ER positive, PR positive, HER2 negative. Recommend surgical excision with wide margins.',
            recordedById: tech1User.id,
        },
    });

    const labTest4 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[12].id, // CAT-010-A (Bacterial Culture)
            caseNo: 'CASE-20251125-003',
            caseDate: new Date('2025-11-25'),
            assignedLabTechnicianId: tech3User.id,
            testPanel: 'Bacterial Culture',
            testMethod: 'Culture & Identification',
            labResultStatus: LabResultStatus.COMPLETED,
        },
    });

    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest4.id,
                parameter: 'Culture Result',
                value: 'Staphylococcus pseudintermedius',
                unit: 'descriptive',
                referenceRange: 'No growth',
                isAbnormal: true,
                notes: 'Moderate to heavy growth',
                recordedById: tech3User.id,
            },
            {
                labTestId: labTest4.id,
                parameter: 'Antibiotic Sensitivity',
                value: 'Sensitive: Amoxicillin-Clavulanate, Cephalexin, Enrofloxacin',
                unit: 'descriptive',
                referenceRange: 'Varies',
                isAbnormal: false,
                notes: 'Resistant: Penicillin, Erythromycin',
                recordedById: tech3User.id,
            },
        ],
    });

    // Lab Tests for APPROVED requests (already reviewed)
    const labTest5 = await prisma.labTest.create({
        data: {
            testRequestSampleId: samples[13].id,
            caseNo: 'CASE-20251120-001',
            caseDate: new Date('2025-11-20'),
            assignedLabTechnicianId: tech1User.id,
            testPanel: 'Wellness Panel',
            testMethod: 'Automated Analyzer',
            labResultStatus: LabResultStatus.APPROVED,
        },
    });

    await prisma.labResult.createMany({
        data: [
            {
                labTestId: labTest5.id,
                parameter: 'Glucose',
                value: '95',
                unit: 'mg/dL',
                referenceRange: '70-138',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
            {
                labTestId: labTest5.id,
                parameter: 'BUN',
                value: '18',
                unit: 'mg/dL',
                referenceRange: '7-27',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
            {
                labTestId: labTest5.id,
                parameter: 'Creatinine',
                value: '1.2',
                unit: 'mg/dL',
                referenceRange: '0.5-1.8',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
            {
                labTestId: labTest5.id,
                parameter: 'ALT',
                value: '45',
                unit: 'U/L',
                referenceRange: '10-100',
                isAbnormal: false,
                recordedById: tech1User.id,
            },
        ],
    });

    console.log(`   ✅ Created lab tests with results`);
    console.log('');

    // ============================================================================
    // 10. CREATE INVOICES
    // ============================================================================
    console.log('💰 Creating invoices with various payment statuses...');

    // Invoice 1: PENDING (for approved request)
    const invoice1 = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-2025-001',
            testRequestId: requests[10].id, // APPROVED request
            customerId: customer1.id,
            invoiceDate: new Date('2025-11-21'),
            dueDate: new Date('2025-12-21'),
            subTotal: 1500.0,
            taxRate: 0.07,
            taxAmount: 105.0,
            netTotal: 1605.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
            issuedById: labAdminUser.id,
        },
    });

    await prisma.invoiceLineItem.createMany({
        data: [
            {
                invoiceId: invoice1.id,
                description: 'Complete Blood Count (CBC)',
                quantity: 1,
                unitPrice: 800.0,
                lineTotal: 800.0,
            },
            {
                invoiceId: invoice1.id,
                description: 'Basic Biochemistry Panel',
                quantity: 1,
                unitPrice: 700.0,
                lineTotal: 700.0,
            },
        ],
    });
    console.log(`   💳 ${invoice1.invoiceNo} - PENDING`);

    // Invoice 2: WAITING_VERIFICATION (payment slip uploaded)
    const invoice2 = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-2025-002',
            testRequestId: requests[11].id, // APPROVED request
            customerId: customer1.id,
            invoiceDate: new Date('2025-11-19'),
            dueDate: new Date('2025-12-19'),
            subTotal: 3500.0,
            taxRate: 0.07,
            taxAmount: 245.0,
            netTotal: 3745.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
            paymentSlipAttachmentUrl: '/uploads/payment-slips/payment-slip-001.pdf',
            issuedById: labAdminUser.id,
        },
    });

    await prisma.invoiceLineItem.createMany({
        data: [
            {
                invoiceId: invoice2.id,
                description: 'Pre-breeding Health Panel',
                quantity: 1,
                unitPrice: 2000.0,
                lineTotal: 2000.0,
            },
            {
                invoiceId: invoice2.id,
                description: 'Genetic Testing',
                quantity: 1,
                unitPrice: 1500.0,
                lineTotal: 1500.0,
            },
        ],
    });
    console.log(`   💳 ${invoice2.invoiceNo} - WAITING_VERIFICATION`);

    // Invoice 3: PAID
    const invoice3 = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-2025-003',
            testRequestId: requests[12].id, // APPROVED request
            customerId: customer2.id,
            invoiceDate: new Date('2025-11-16'),
            dueDate: new Date('2025-12-16'),
            subTotal: 1200.0,
            taxRate: 0.07,
            taxAmount: 84.0,
            netTotal: 1284.0,
            paymentStatus: InvoicePaymentStatus.PAID,
            paymentSlipAttachmentUrl: '/uploads/payment-slips/payment-slip-002.pdf',
            issuedById: labAdminUser.id,
        },
    });

    await prisma.invoiceLineItem.create({
        data: {
            invoiceId: invoice3.id,
            description: 'Post-treatment Monitoring Panel',
            quantity: 1,
            unitPrice: 1200.0,
            lineTotal: 1200.0,
        },
    });
    console.log(`   💳 ${invoice3.invoiceNo} - PAID`);

    // Invoice 4: OVERDUE
    const invoice4 = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-2025-004',
            testRequestId: requests[10].id,
            customerId: customer1.id,
            invoiceDate: new Date('2025-10-15'),
            dueDate: new Date('2025-11-14'), // Past due
            subTotal: 2500.0,
            taxRate: 0.07,
            taxAmount: 175.0,
            netTotal: 2675.0,
            paymentStatus: InvoicePaymentStatus.OVERDUE,
            issuedById: labAdminUser.id,
        },
    });

    await prisma.invoiceLineItem.createMany({
        data: [
            {
                invoiceId: invoice4.id,
                description: 'Comprehensive Metabolic Panel',
                quantity: 1,
                unitPrice: 1500.0,
                lineTotal: 1500.0,
            },
            {
                invoiceId: invoice4.id,
                description: 'Complete Urinalysis',
                quantity: 1,
                unitPrice: 500.0,
                lineTotal: 500.0,
            },
            {
                invoiceId: invoice4.id,
                description: 'Fecal Examination',
                quantity: 1,
                unitPrice: 500.0,
                lineTotal: 500.0,
            },
        ],
    });
    console.log(`   💳 ${invoice4.invoiceNo} - OVERDUE`);

    // Invoice 5: PENDING (for another customer)
    const invoice5 = await prisma.invoice.create({
        data: {
            invoiceNo: 'INV-2025-005',
            testRequestId: requests[12].id,
            customerId: customer2.id,
            invoiceDate: new Date('2025-11-25'),
            dueDate: new Date('2025-12-25'),
            subTotal: 800.0,
            taxRate: 0.07,
            taxAmount: 56.0,
            netTotal: 856.0,
            paymentStatus: InvoicePaymentStatus.PENDING,
            issuedById: labAdminUser.id,
        },
    });

    await prisma.invoiceLineItem.create({
        data: {
            invoiceId: invoice5.id,
            description: 'Basic Health Screening',
            quantity: 1,
            unitPrice: 800.0,
            lineTotal: 800.0,
        },
    });
    console.log(`   💳 ${invoice5.invoiceNo} - PENDING`);

    console.log('');

    // ============================================================================
    // 11. CREATE AUDIT TRAIL ENTRIES
    // ============================================================================
    console.log('📜 Creating audit trail entries...');

    const auditEntries = [
        {
            userId: customer1User.id,
            action: 'CREATE_TEST_REQUEST',
            entityType: 'TestRequest',
            entityId: requests[0].id,
            details: { requestNo: 'ABC-20251128-001', status: 'DRAFT' },
        },
        {
            userId: tech1User.id,
            action: 'ACKNOWLEDGE_SAMPLES',
            entityType: 'TestRequest',
            entityId: requests[5].id,
            details: { requestNo: 'ABC-20251126-001', samplesCount: 1 },
        },
        {
            userId: tech2User.id,
            action: 'ENTER_LAB_RESULTS',
            entityType: 'LabTest',
            entityId: labTest2.id,
            details: { caseNo: 'CASE-20251125-001', resultsCount: 5 },
        },
        {
            userId: doctor1User.id,
            action: 'APPROVE_TEST_REQUEST',
            entityType: 'TestRequest',
            entityId: requests[10].id,
            details: { requestNo: 'ABC-20251120-001', approvalDate: '2025-11-21' },
        },
        {
            userId: doctor1User.id,
            action: 'REJECT_TEST_REQUEST',
            entityType: 'TestRequest',
            entityId: requests[13].id,
            details: {
                requestNo: 'ABC-20251110-001',
                reason: 'Sample quality insufficient',
            },
        },
        {
            userId: customer1User.id,
            action: 'UPLOAD_PAYMENT_SLIP',
            entityType: 'Invoice',
            entityId: invoice2.id,
            details: { invoiceNo: 'INV-2025-002', fileName: 'payment-slip-001.pdf' },
        },
        {
            userId: labAdminUser.id,
            action: 'MARK_INVOICE_PAID',
            entityType: 'Invoice',
            entityId: invoice3.id,
            details: { invoiceNo: 'INV-2025-003', amount: 1284.0 },
        },
        {
            userId: adminUser.id,
            action: 'CREATE_USER',
            entityType: 'User',
            entityId: tech3User.id,
            details: { email: 'tech3@starlab.com', role: 'TECHNICIAN' },
        },
    ];

    for (const entry of auditEntries) {
        await prisma.auditTrail.create({ data: entry });
    }

    console.log(`   ✅ Created ${auditEntries.length} audit trail entries`);
    console.log('');

    // ============================================================================
    // 12. CREATE STATUS HISTORY
    // ============================================================================
    console.log('📊 Creating status history for requests...');

    await prisma.testRequestStatusHistory.createMany({
        data: [
            // === SUBMITTED Requests (requests[2], [3], [4]) ===
            // Request 2: DRAFT -> SUBMITTED
            {
                testRequestId: requests[2].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-27T09:00:00Z'),
            },
            // Request 3: DRAFT -> SUBMITTED
            {
                testRequestId: requests[3].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-27T10:30:00Z'),
            },
            // Request 4: DRAFT -> SUBMITTED
            {
                testRequestId: requests[4].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer2.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-27T14:15:00Z'),
            },

            // === RECEIVED_SAMPLES Requests (requests[5], [6]) ===
            // Request 5: DRAFT -> SUBMITTED
            {
                testRequestId: requests[5].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-26T08:45:00Z'),
            },
            // Request 6: DRAFT -> SUBMITTED
            {
                testRequestId: requests[6].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer2.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-26T11:20:00Z'),
            },

            // === RESULT_READY Requests (requests[7], [8], [9]) ===
            // Request 7: DRAFT -> SUBMITTED -> RESULT_READY
            {
                testRequestId: requests[7].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-25T09:00:00Z'),
            },
            {
                testRequestId: requests[7].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech2User.id,
                notes: 'All lab tests completed. Results ready for review.',
                changedAt: new Date('2025-11-25T15:30:00Z'),
            },
            // Request 8: DRAFT -> SUBMITTED -> RESULT_READY
            {
                testRequestId: requests[8].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-25T09:15:00Z'),
            },
            {
                testRequestId: requests[8].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech1User.id,
                notes: 'Histopathology results uploaded.',
                changedAt: new Date('2025-11-25T16:45:00Z'),
            },
            // Request 9: DRAFT -> SUBMITTED -> RESULT_READY
            {
                testRequestId: requests[9].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer2.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-25T10:00:00Z'),
            },
            {
                testRequestId: requests[9].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech3User.id,
                notes: 'Culture results finalized.',
                changedAt: new Date('2025-11-25T14:20:00Z'),
            },

            // === APPROVED Requests (requests[10], [11], [12]) ===
            // Request 10: DRAFT -> SUBMITTED -> RESULT_READY -> APPROVED
            {
                testRequestId: requests[10].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-20T08:30:00Z'),
            },
            {
                testRequestId: requests[10].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech1User.id,
                notes: 'Results uploaded and ready for doctor review',
                changedAt: new Date('2025-11-20T14:00:00Z'),
            },
            {
                testRequestId: requests[10].id,
                fromStatus: TestRequestDocumentStatus.RESULT_READY,
                toStatus: TestRequestDocumentStatus.APPROVED,
                changedById: doctor1User.id,
                notes: 'Approved by Dr. Smith',
                changedAt: new Date('2025-11-21T10:30:00Z'),
            },
            // Request 11: DRAFT -> SUBMITTED -> RESULT_READY -> APPROVED
            {
                testRequestId: requests[11].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-18T09:00:00Z'),
            },
            {
                testRequestId: requests[11].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech1User.id,
                notes: 'Results ready.',
                changedAt: new Date('2025-11-19T11:00:00Z'),
            },
            {
                testRequestId: requests[11].id,
                fromStatus: TestRequestDocumentStatus.RESULT_READY,
                toStatus: TestRequestDocumentStatus.APPROVED,
                changedById: doctor2User.id,
                notes: 'Approved. All parameters within normal limits.',
                changedAt: new Date('2025-11-19T14:15:00Z'),
            },
            // Request 12: DRAFT -> SUBMITTED -> RESULT_READY -> APPROVED
            {
                testRequestId: requests[12].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer2.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-15T10:00:00Z'),
            },
            {
                testRequestId: requests[12].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.RESULT_READY,
                changedById: tech1User.id,
                notes: 'Results ready.',
                changedAt: new Date('2025-11-15T16:00:00Z'),
            },
            {
                testRequestId: requests[12].id,
                fromStatus: TestRequestDocumentStatus.RESULT_READY,
                toStatus: TestRequestDocumentStatus.APPROVED,
                changedById: doctor1User.id,
                notes: 'Approved.',
                changedAt: new Date('2025-11-16T09:00:00Z'),
            },

            // === REJECTED Request (requests[13]) ===
            // Request 13: DRAFT -> SUBMITTED -> REJECTED
            {
                testRequestId: requests[13].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.SUBMITTED,
                changedById: customer1.userId,
                notes: 'Submitted for processing',
                changedAt: new Date('2025-11-10T08:00:00Z'),
            },
            {
                testRequestId: requests[13].id,
                fromStatus: TestRequestDocumentStatus.SUBMITTED,
                toStatus: TestRequestDocumentStatus.REJECTED,
                changedById: doctor1User.id,
                notes: 'Rejected due to sample quality issues',
                changedAt: new Date('2025-11-12T16:45:00Z'),
            },

            // === CANCELLED Request (requests[14]) ===
            // Request 14: DRAFT -> CANCELLED
            {
                testRequestId: requests[14].id,
                fromStatus: TestRequestDocumentStatus.DRAFT,
                toStatus: TestRequestDocumentStatus.CANCELLED,
                changedById: customer2.userId,
                notes: 'Customer cancelled request',
                changedAt: new Date('2025-11-05T11:00:00Z'),
            },
        ],
    });

    console.log(`   ✅ Created status history entries`);
    console.log('');

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 COMPREHENSIVE SEED DATA CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('👥 USERS:');
    console.log('   • 1 ADMIN (admin@starlab.com)');
    console.log('   • 1 LAB_ADMIN (labadmin@starlab.com)');
    console.log('   • 2 CUSTOMERS (customer@example.com, customer2@example.com)');
    console.log('   • 3 TECHNICIANS (tech@starlab.com, tech2@starlab.com, tech3@starlab.com)');
    console.log('   • 2 DOCTORS (doctor@starlab.com, doctor2@starlab.com)');
    console.log('   • 1 APPROVAL (approval@starlab.com)');
    console.log('   📌 Password for all users: "password"');
    console.log('');
    console.log('🏢 COMPANIES:');
    console.log('   • ABC Company Ltd (Code: ABC)');
    console.log('   • XYZ Corporation (Code: XYZ)');
    console.log('');
    console.log('📝 TEST REQUESTS:');
    console.log(`   • 2 DRAFT requests (editable)`);
    console.log(`   • 3 SUBMITTED requests (awaiting lab acknowledgment)`);
    console.log(`   • 2 RECEIVED_SAMPLES requests (in processing)`);
    console.log(`   • 3 RESULT_READY requests (awaiting doctor approval)`);
    console.log(`   • 3 APPROVED requests (completed)`);
    console.log(`   • 1 REJECTED request (with reason)`);
    console.log(`   • 1 CANCELLED request`);
    console.log(`   📊 Total: ${requests.length} test requests`);
    console.log('');
    console.log('🧪 SAMPLES:');
    console.log(`   • ${samples.length} samples with variety:`);
    console.log('     - Animals: Dog, Cat');
    console.log('     - Specimens: Blood, Serum, Tissue, Swab, Urine');
    console.log('     - Panels: CBC, Chemistry, Histopathology, Culture, etc.');
    console.log('     - Statuses: RECEIVED, IN_TESTING, COMPLETED, CONSUMED, REJECTED');
    console.log('');
    console.log('🔬 LAB TESTS:');
    console.log('   • Lab tests with results (some with abnormal flags)');
    console.log('   • Assigned to different technicians');
    console.log('   • Various statuses: PARTIAL, COMPLETED, APPROVED');
    console.log('');
    console.log('💰 INVOICES:');
    console.log('   • 2 PENDING invoices');
    console.log('   • 1 WAITING_VERIFICATION invoice (payment slip uploaded)');
    console.log('   • 1 PAID invoice');
    console.log('   • 1 OVERDUE invoice');
    console.log('');
    console.log('📜 AUDIT TRAIL:');
    console.log('   • Sample audit entries covering key actions');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Ready for comprehensive testing!');
    console.log('   Follow test flows in: docs/testing/FULL_USER_ROLE_TEST_FLOWS.md');
    console.log('═══════════════════════════════════════════════════════════');
}

main()
    .catch((e) => {
        console.error('❌ Error occurred during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Database client disconnected.');
    });
