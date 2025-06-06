import connectToDatabase from './mongodb';
import Department from '@/models/Department';
import User from '@/models/User';

const departments = [
  {
    name: 'Bihar State Electricity Board',
    shortName: 'BSEB',
    email: 'complaints@bseb.org',
    phone: '+91-612-2234567',
    category: 'utilities',
    location: ['patna', 'bihar', 'all'],
    responseTime: 48,
    isActive: true
  },
  {
    name: 'Indian Railways - Patna Division',
    shortName: 'RAILWAYS',
    email: 'complaints@indianrailways.gov.in',
    phone: '+91-612-2345678',
    category: 'transportation',
    location: ['patna', 'bihar', 'all'],
    responseTime: 72,
    isActive: true
  },
  {
    name: 'Patna Municipal Corporation',
    shortName: 'PMC',
    email: 'complaints@pmc.gov.in',
    phone: '+91-612-2456789',
    category: 'municipal',
    location: ['patna', 'bihar'],
    responseTime: 24,
    isActive: true
  },
  {
    name: 'Bihar Police',
    shortName: 'POLICE',
    email: 'complaints@biharpolice.gov.in',
    phone: '+91-612-2567890',
    category: 'police',
    location: ['patna', 'bihar', 'all'],
    responseTime: 12,
    isActive: true
  },
  {
    name: 'Public Health Department - Bihar',
    shortName: 'PHD',
    email: 'complaints@health.bihar.gov.in',
    phone: '+91-612-2678901',
    category: 'health',
    location: ['patna', 'bihar', 'all'],
    responseTime: 36,
    isActive: true
  },
  {
    name: 'Education Department - Bihar',
    shortName: 'EDU',
    email: 'complaints@education.bihar.gov.in',
    phone: '+91-612-2789012',
    category: 'education',
    location: ['patna', 'bihar', 'all'],
    responseTime: 48,
    isActive: true
  }
];

const adminUsers = [
  {
    email: 'admin@bseb.org',
    name: 'Amit Singh',
    password: 'admin123', // In production, this should be hashed
    role: 'department_admin',
    permissions: ['view_complaints', 'update_status', 'respond'],
    isActive: true
  },
  {
    email: 'admin@railways.gov.in',
    name: 'Priya Sharma',
    password: 'admin123',
    role: 'department_admin',
    permissions: ['view_complaints', 'update_status', 'respond'],
    isActive: true
  },
  {
    email: 'admin@pmc.gov.in',
    name: 'Rajesh Kumar',
    password: 'admin123',
    role: 'department_admin',
    permissions: ['view_complaints', 'update_status', 'respond'],
    isActive: true
  },
  {
    email: 'admin@sevalink.gov.in',
    name: 'Super Admin',
    password: 'superadmin123',
    role: 'admin',
    permissions: ['view_complaints', 'update_status', 'respond', 'escalate', 'view_analytics', 'manage_users'],
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    await connectToDatabase();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Department.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Insert departments
    const insertedDepartments = await Department.insertMany(departments);
    console.log(`✅ Inserted ${insertedDepartments.length} departments`);

    // Insert admin users with department references
    const usersWithDepartments = adminUsers.map((user, index) => {
      if (user.role === 'department_admin' && insertedDepartments[index]) {
        return {
          ...user,
          department: insertedDepartments[index]._id
        };
      }
      return user;
    });

    const insertedUsers = await User.insertMany(usersWithDepartments);
    console.log(`✅ Inserted ${insertedUsers.length} admin users`);

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      departments: insertedDepartments,
      users: insertedUsers
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
} 