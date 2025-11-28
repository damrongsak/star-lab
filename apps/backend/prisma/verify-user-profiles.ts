/**
 * Verification Script for User Profiles
 *
 * This script verifies that all user profiles have been properly seeded.
 *
 * Usage: npx tsx apps/backend/prisma/verify-user-profiles.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verifying user profiles...\n');

    // Get all users with their profiles
    const users = await prisma.user.findMany({
        include: {
            userProfile: true,
            customer: true,
            doctor: true,
        },
        orderBy: [
            { role: 'asc' },
            { email: 'asc' },
        ],
    });

    console.log(`📊 Total users in database: ${users.length}\n`);

    // Group by role
    const byRole = users.reduce((acc, user) => {
        if (!acc[user.role]) {
            acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
    }, {} as Record<string, typeof users>);

    // Display by role
    for (const [role, roleUsers] of Object.entries(byRole)) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`${role} (${roleUsers.length} users)`);
        console.log('='.repeat(60));

        for (const user of roleUsers) {
            const profile = user.userProfile;
            const hasProfile = profile !== null;

            console.log(`\n📧 ${user.email}`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email Confirmed: ${user.isEmailConfirmed ? '✅' : '❌'}`);

            if (hasProfile) {
                console.log(`   ✅ Profile: ${profile.firstName} ${profile.lastName}`);
                console.log(`   📞 Phone: ${profile.phoneNumber}`);
                console.log(`   Active: ${profile.isActive ? '✅' : '❌'}`);
            } else {
                console.log(`   ❌ No profile found!`);
            }

            if (user.customer) {
                console.log(`   🏢 Customer: ${user.customer.companyNameEn}`);
                console.log(`   🆔 Legal Entity: ${user.customer.legalEntityId}`);
            }

            if (user.doctor) {
                console.log(`   🩺 Doctor License: ${user.doctor.licenseNumber}`);
                console.log(`   🎓 Specialization: ${user.doctor.specialization}`);
            }
        }
    }

    // Summary statistics
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 SUMMARY STATISTICS');
    console.log('='.repeat(60));

    const usersWithProfiles = users.filter(u => u.userProfile !== null).length;
    const usersWithoutProfiles = users.filter(u => u.userProfile === null).length;
    const customers = users.filter(u => u.customer !== null).length;
    const doctors = users.filter(u => u.doctor !== null).length;
    const activeProfiles = users.filter(u => u.userProfile?.isActive === true).length;
    const inactiveProfiles = users.filter(u => u.userProfile?.isActive === false).length;

    console.log(`\n👤 Users:`);
    console.log(`   Total: ${users.length}`);
    console.log(`   With profiles: ${usersWithProfiles}`);
    console.log(`   Without profiles: ${usersWithoutProfiles}`);

    console.log(`\n📋 Profile Status:`);
    console.log(`   Active: ${activeProfiles}`);
    console.log(`   Inactive: ${inactiveProfiles}`);

    console.log(`\n🏢 Related Entities:`);
    console.log(`   Customers: ${customers}`);
    console.log(`   Doctors: ${doctors}`);

    console.log(`\n📋 By Role:`);
    for (const [role, roleUsers] of Object.entries(byRole)) {
        const withProfiles = roleUsers.filter(u => u.userProfile !== null).length;
        console.log(`   ${role}: ${roleUsers.length} users (${withProfiles} with profiles)`);
    }

    // Validation checks
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('✅ VALIDATION CHECKS');
    console.log('='.repeat(60));

    const checks = [
        {
            name: 'All users have profiles',
            pass: usersWithoutProfiles === 0,
            message: usersWithoutProfiles === 0
                ? '✅ All users have profiles'
                : `❌ ${usersWithoutProfiles} users missing profiles`,
        },
        {
            name: 'All CUSTOMER users have customer records',
            pass: byRole['CUSTOMER']?.every(u => u.customer !== null) ?? true,
            message: byRole['CUSTOMER']?.every(u => u.customer !== null) ?? true
                ? '✅ All CUSTOMER users have customer records'
                : '❌ Some CUSTOMER users missing customer records',
        },
        {
            name: 'All DOCTOR users have doctor records',
            pass: byRole['DOCTOR']?.every(u => u.doctor !== null) ?? true,
            message: byRole['DOCTOR']?.every(u => u.doctor !== null) ?? true
                ? '✅ All DOCTOR users have doctor records'
                : '❌ Some DOCTOR users missing doctor records',
        },
        {
            name: 'At least 2 inactive users for testing',
            pass: inactiveProfiles >= 2,
            message: inactiveProfiles >= 2
                ? `✅ ${inactiveProfiles} inactive users for testing`
                : `⚠️ Only ${inactiveProfiles} inactive users (expected at least 2)`,
        },
    ];

    let allPassed = true;
    for (const check of checks) {
        console.log(`\n${check.message}`);
        if (!check.pass) allPassed = false;
    }

    console.log(`\n${'='.repeat(60)}`);
    if (allPassed) {
        console.log('✅ All validation checks passed!');
    } else {
        console.log('⚠️ Some validation checks failed. Please review above.');
    }
    console.log('='.repeat(60));
}

main()
    .catch((e) => {
        console.error('\n❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('\n🔌 Database client disconnected.');
    });
