import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedDatabase';

export async function POST() {
  try {
    const result = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        departmentsCount: result.departments.length,
        usersCount: result.users.length
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 