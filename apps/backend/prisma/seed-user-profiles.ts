/**
 * Comprehensive User Profiles Seed Script
 *
 * This script creates users with profiles for all 6 user roles in the STAR-LAB system:
 * - ADMIN: System administrators
 * - CUSTOMER: Company representatives
 * - DOCTOR: Medical professionals for approval workflow
 * - TECHNICIAN: Lab technicians
 * - LAB_ADMIN: Lab management
 * - APPROVAL: Quality assurance and approval staff
 *
 * For CUSTOMER users, this also creates Customer records with company data.
 * For DOCTOR users, this also creates Doctor records with license and specialization.
 *
 * Usage: npx tsx apps/backend/prisma/seed-user-profiles.ts
 */

import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import process from 'process';

const prisma = new PrismaClient();

/**
 * User profile data interface
 */
interface UserProfileData {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isActive: boolean;
    password: string;
    // For CUSTOMER users
    customerData?: {
        companyNameEn: string;
        companyNameTh: string;
        legalEntityId: string;
        companyDescription: string;
        companyAddressLine1: string;
        companyProvince: string;
        companyDistrict: string;
        companySubDistrict: string;
        companyZipCode: string;
        companyPhone: string;
        companyFax?: string;
        operatorIdCard: string;
        operatorPrefix: string;
        receiptAddressBuildingFloorNumber: string;
        receiptProvince: string;
        receiptDistrict: string;
        receiptSubDistrict: string;
        receiptZipCode: string;
        receiptPhone: string;
        receiptFax?: string;
    };
    // For DOCTOR users
    doctorData?: {
        licenseNumber: string;
        specialization: string;
        qualifications: string;
    };
}

/**
 * Comprehensive user profile data for all roles
 */
const userProfilesData: UserProfileData[] = [
    // ========== ADMIN USERS (3) ==========
    {
        email: 'admin@starlab.com',
        role: UserRole.ADMIN,
        firstName: 'Somchai',
        lastName: 'Adminwong',
        phoneNumber: '081-234-5678',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'admin2@starlab.com',
        role: UserRole.ADMIN,
        firstName: 'Prasert',
        lastName: 'Techmanager',
        phoneNumber: '082-345-6789',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'superadmin@starlab.com',
        role: UserRole.ADMIN,
        firstName: 'Anuchit',
        lastName: 'Sysadmin',
        phoneNumber: '083-456-7890',
        isActive: true,
        password: 'password123',
    },

    // ========== CUSTOMER USERS (4) ==========
    {
        email: 'customer@starlab.com',
        role: UserRole.CUSTOMER,
        firstName: 'Somphong',
        lastName: 'Businessowner',
        phoneNumber: '081-234-5678',
        isActive: true,
        password: 'mock-password',
        customerData: {
            companyNameEn: 'Star Lab Co., Ltd.',
            companyNameTh: 'บริษัท สตาร์แลบ จำกัด',
            legalEntityId: '0105551234567',
            companyDescription: 'Leading laboratory testing services provider',
            companyAddressLine1: '123/4 Sukhumvit Road',
            companyProvince: 'Bangkok',
            companyDistrict: 'Pathumwan',
            companySubDistrict: 'Lumphini',
            companyZipCode: '10330',
            companyPhone: '021234567',
            companyFax: '021234568',
            operatorIdCard: '1234567890123',
            operatorPrefix: 'Mr.',
            receiptAddressBuildingFloorNumber: '123/4 Floor 12A',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Pathumwan',
            receiptSubDistrict: 'Lumphini',
            receiptZipCode: '10330',
            receiptPhone: '021234567',
            receiptFax: '021234568',
        },
    },
    {
        email: 'customer2@starlab.com',
        role: UserRole.CUSTOMER,
        firstName: 'Natthawut',
        lastName: 'Researchdirector',
        phoneNumber: '084-567-8901',
        isActive: true,
        password: 'password123',
        customerData: {
            companyNameEn: 'Tech Research Institute',
            companyNameTh: 'สถาบันวิจัยเทคโนโลยี',
            legalEntityId: '0105559876543',
            companyDescription: 'Advanced technology research and development',
            companyAddressLine1: '456/7 Rama IV Road',
            companyProvince: 'Bangkok',
            companyDistrict: 'Klong Toey',
            companySubDistrict: 'Klong Toey',
            companyZipCode: '10110',
            companyPhone: '027654321',
            companyFax: '027654322',
            operatorIdCard: '9876543210987',
            operatorPrefix: 'Dr.',
            receiptAddressBuildingFloorNumber: '456/7 Floor 8',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Klong Toey',
            receiptSubDistrict: 'Klong Toey',
            receiptZipCode: '10110',
            receiptPhone: '027654321',
        },
    },
    {
        email: 'customer3@starlab.com',
        role: UserRole.CUSTOMER,
        firstName: 'Pimchanok',
        lastName: 'Biotech',
        phoneNumber: '085-678-9012',
        isActive: true,
        password: 'password123',
        customerData: {
            companyNameEn: 'Bio Solutions Co., Ltd.',
            companyNameTh: 'บริษัท ไบโอโซลูชั่น จำกัด',
            legalEntityId: '0105552223334',
            companyDescription: 'Biotechnology and medical testing services',
            companyAddressLine1: '789/10 Vibhavadi Rangsit Road',
            companyProvince: 'Bangkok',
            companyDistrict: 'Chatuchak',
            companySubDistrict: 'Lat Yao',
            companyZipCode: '10900',
            companyPhone: '025551234',
            operatorIdCard: '5554443332221',
            operatorPrefix: 'Ms.',
            receiptAddressBuildingFloorNumber: '789/10 Building B',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Chatuchak',
            receiptSubDistrict: 'Lat Yao',
            receiptZipCode: '10900',
            receiptPhone: '025551234',
        },
    },
    {
        email: 'customer4@starlab.com',
        role: UserRole.CUSTOMER,
        firstName: 'Wichai',
        lastName: 'Medicalcorp',
        phoneNumber: '086-789-0123',
        isActive: false, // Inactive for testing
        password: 'password123',
        customerData: {
            companyNameEn: 'Medical Testing Corp.',
            companyNameTh: 'บริษัท เมดิคอลเทสติ้ง จำกัด',
            legalEntityId: '0105556667778',
            companyDescription: 'Clinical laboratory and medical diagnostics',
            companyAddressLine1: '321/5 Phaholyothin Road',
            companyProvince: 'Bangkok',
            companyDistrict: 'Phaya Thai',
            companySubDistrict: 'Phaya Thai',
            companyZipCode: '10400',
            companyPhone: '029876543',
            companyFax: '029876544',
            operatorIdCard: '1112223334445',
            operatorPrefix: 'Mr.',
            receiptAddressBuildingFloorNumber: '321/5',
            receiptProvince: 'Bangkok',
            receiptDistrict: 'Phaya Thai',
            receiptSubDistrict: 'Phaya Thai',
            receiptZipCode: '10400',
            receiptPhone: '029876543',
        },
    },

    // ========== DOCTOR USERS (3) ==========
    {
        email: 'doctor@starlab.com',
        role: UserRole.DOCTOR,
        firstName: 'Siriwan',
        lastName: 'Saetang',
        phoneNumber: '089-456-7890',
        isActive: true,
        password: 'password123',
        doctorData: {
            licenseNumber: 'DR-12345',
            specialization: 'Laboratory Medicine',
            qualifications: 'MD, PhD in Laboratory Medicine, Board Certified',
        },
    },
    {
        email: 'doctor2@starlab.com',
        role: UserRole.DOCTOR,
        firstName: 'Chatchai',
        lastName: 'Pathologist',
        phoneNumber: '089-567-8901',
        isActive: true,
        password: 'password123',
        doctorData: {
            licenseNumber: 'DR-23456',
            specialization: 'Pathology',
            qualifications: 'MD, Specialist in Anatomical Pathology',
        },
    },
    {
        email: 'doctor3@starlab.com',
        role: UserRole.DOCTOR,
        firstName: 'Rattana',
        lastName: 'Clinicalspec',
        phoneNumber: '089-678-9012',
        isActive: true,
        password: 'password123',
        doctorData: {
            licenseNumber: 'DR-34567',
            specialization: 'Clinical Chemistry',
            qualifications: 'MD, PhD in Clinical Chemistry and Toxicology',
        },
    },

    // ========== TECHNICIAN USERS (4) ==========
    {
        email: 'technician1@starlab.com',
        role: UserRole.TECHNICIAN,
        firstName: 'Nattapong',
        lastName: 'Hematology',
        phoneNumber: '082-345-6789',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'technician2@starlab.com',
        role: UserRole.TECHNICIAN,
        firstName: 'Sumalee',
        lastName: 'Microbio',
        phoneNumber: '082-456-7890',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'technician3@starlab.com',
        role: UserRole.TECHNICIAN,
        firstName: 'Apisit',
        lastName: 'Chemistry',
        phoneNumber: '082-567-8901',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'technician4@starlab.com',
        role: UserRole.TECHNICIAN,
        firstName: 'Wanida',
        lastName: 'Seniortech',
        phoneNumber: '082-678-9012',
        isActive: true,
        password: 'password123',
    },

    // ========== LAB_ADMIN USERS (2) ==========
    {
        email: 'labadmin@starlab.com',
        role: UserRole.LAB_ADMIN,
        firstName: 'Piyaporn',
        lastName: 'Labmanager',
        phoneNumber: '083-456-7890',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'labadmin2@starlab.com',
        role: UserRole.LAB_ADMIN,
        firstName: 'Suriya',
        lastName: 'Labsupervisor',
        phoneNumber: '083-567-8901',
        isActive: false, // Inactive for testing
        password: 'password123',
    },

    // ========== APPROVAL USERS (2) ==========
    {
        email: 'approval@starlab.com',
        role: UserRole.APPROVAL,
        firstName: 'Chaiyaporn',
        lastName: 'QualityControl',
        phoneNumber: '084-567-8901',
        isActive: true,
        password: 'password123',
    },
    {
        email: 'approval2@starlab.com',
        role: UserRole.APPROVAL,
        firstName: 'Kanokwan',
        lastName: 'QAManager',
        phoneNumber: '084-678-9012',
        isActive: true,
        password: 'password123',
    },
];

/**
 * Main seeding function
 */
async function main() {
    console.log('🌱 Starting comprehensive user profiles seeding...\n');

    const hashedPassword = await bcrypt.hash('password123', 10);
    let totalUsers = 0;
    let totalProfiles = 0;
    let totalCustomers = 0;
    let totalDoctors = 0;

    for (const userData of userProfilesData) {
        try {
            // 1. Create or update user
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    role: userData.role,
                    passwordHash: hashedPassword,
                    isEmailConfirmed: true,
                    verificationToken: null,
                },
            });
            totalUsers++;
            console.log(`👤 Upserted user: ${user.email} (${user.role})`);

            // 2. Create user profile
            const profile = await prisma.userProfile.upsert({
                where: { userId: user.id },
                update: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phoneNumber: userData.phoneNumber,
                    isActive: userData.isActive,
                },
                create: {
                    userId: user.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phoneNumber: userData.phoneNumber,
                    isActive: userData.isActive,
                },
            });
            totalProfiles++;
            console.log(`   📋 Profile: ${profile.firstName} ${profile.lastName} - Active: ${profile.isActive}`);

            // 3. Create Customer record for CUSTOMER users
            if (userData.role === UserRole.CUSTOMER && userData.customerData) {
                const customer = await prisma.customer.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        companyNameEn: userData.customerData.companyNameEn,
                        companyNameTh: userData.customerData.companyNameTh,
                        legalEntityId: userData.customerData.legalEntityId,
                        companyDescription: userData.customerData.companyDescription,
                        companyAddressLine1: userData.customerData.companyAddressLine1,
                        companyProvince: userData.customerData.companyProvince,
                        companyDistrict: userData.customerData.companyDistrict,
                        companySubDistrict: userData.customerData.companySubDistrict,
                        companyZipCode: userData.customerData.companyZipCode,
                        companyPhone: userData.customerData.companyPhone,
                        companyFax: userData.customerData.companyFax || null,
                        companyRegistrationAttachmentsIds: [],
                        operatorIdCard: userData.customerData.operatorIdCard,
                        operatorPrefix: userData.customerData.operatorPrefix,
                        operatorFirstName: userData.firstName,
                        operatorLastName: userData.lastName,
                        operatorMobilePhone: userData.phoneNumber,
                        operatorPhone: userData.customerData.companyPhone,
                        operatorIdCardAttachmentsIds: [],
                        receiptAddressBuildingFloorNumber: userData.customerData.receiptAddressBuildingFloorNumber,
                        receiptProvince: userData.customerData.receiptProvince,
                        receiptDistrict: userData.customerData.receiptDistrict,
                        receiptSubDistrict: userData.customerData.receiptSubDistrict,
                        receiptZipCode: userData.customerData.receiptZipCode,
                        receiptPhone: userData.customerData.receiptPhone,
                        receiptFax: userData.customerData.receiptFax || null,
                    },
                });
                totalCustomers++;
                console.log(`   🏢 Customer: ${customer.companyNameEn}`);
            }

            // 4. Create Doctor record for DOCTOR users
            if (userData.role === UserRole.DOCTOR && userData.doctorData) {
                const doctor = await prisma.doctor.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        licenseNumber: userData.doctorData.licenseNumber,
                        specialization: userData.doctorData.specialization,
                        qualifications: userData.doctorData.qualifications,
                        isActive: userData.isActive,
                    },
                });
                totalDoctors++;
                console.log(`   🩺 Doctor: ${doctor.licenseNumber} - ${doctor.specialization}`);
            }

            console.log(''); // Empty line for readability
        } catch (error) {
            console.error(`❌ Error seeding ${userData.email}:`, error);
            throw error;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ User Profiles Seeding Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Total users: ${totalUsers}`);
    console.log(`   - Total profiles: ${totalProfiles}`);
    console.log(`   - Total customers: ${totalCustomers}`);
    console.log(`   - Total doctors: ${totalDoctors}`);
    console.log('\n📋 Breakdown by role:');
    console.log(`   - ADMIN: 3 users`);
    console.log(`   - CUSTOMER: 4 users (with company data)`);
    console.log(`   - DOCTOR: 3 users (with license & specialization)`);
    console.log(`   - TECHNICIAN: 4 users`);
    console.log(`   - LAB_ADMIN: 2 users`);
    console.log(`   - APPROVAL: 2 users`);
    console.log('\n🔐 Default password for all users: password123');
    console.log('='.repeat(60));
}

/**
 * Execute main function with error handling
 */
main()
    .catch((e) => {
        console.error('\n❌ An error occurred during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('\n🔌 Database client disconnected.');
    });
