import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Department from '@/models/Department';

// Generate unique complaint ID
function generateComplaintId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SVL${year}${timestamp}${random}`;
}

// Smart department routing based on category and location
async function smartRouting(category: string, pincode: string) {
  await connectToDatabase();
  
  // Find department based on category and location
  const department = await Department.findOne({
    category: category === 'electricity' ? 'utilities' : 
             category === 'railways' ? 'transportation' :
             category === 'police' ? 'police' :
             category === 'water' ? 'utilities' :
             category === 'roads' ? 'transportation' :
             category === 'health' ? 'health' :
             category === 'education' ? 'education' :
             'municipal',
    location: { $in: ['patna', 'bihar', 'all'] },
    isActive: true
  });

  return department;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, description, category, priority, citizen, location } = body;
    
    if (!title || !description || !category || !citizen || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Smart routing to determine department
    const department = await smartRouting(category, location.pincode);
    
    if (!department) {
      return NextResponse.json(
        { error: 'No appropriate department found for this complaint' },
        { status: 400 }
      );
    }

    // Generate unique complaint ID
    const complaintId = generateComplaintId();

    // Create complaint
    const complaint = new Complaint({
      complaintId,
      title,
      description,
      category,
      priority: priority || 'medium',
      citizen,
      location,
      department: {
        id: department._id,
        name: department.name
      },
      timeline: [{
        status: 'new',
        timestamp: new Date(),
        note: 'Complaint submitted successfully'
      }],
      tags: generateTags(title, description, category)
    });

    await complaint.save();

    return NextResponse.json({
      success: true,
      complaintId,
      message: 'Complaint filed successfully',
      department: department.name,
      estimatedResponseTime: `${department.responseTime} hours`
    }, { status: 201 });

  } catch (error) {
    console.error('Error filing complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const email = searchParams.get('email');

    await connectToDatabase();

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (email) query['citizen.email'] = email;

    // Get complaints with pagination
    const complaints = await Complaint.find(query)
      .populate('department.id', 'name shortName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    return NextResponse.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate relevant tags for complaints
function generateTags(title: string, description: string, category: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags = [category];
  
  // Common keywords for tagging
  const keywords = {
    urgent: ['urgent', 'emergency', 'immediate', 'asap'],
    power: ['electricity', 'power', 'current', 'voltage', 'outage', 'blackout'],
    water: ['water', 'supply', 'leakage', 'pipe', 'drainage'],
    road: ['road', 'pothole', 'street', 'traffic', 'signal'],
    railway: ['train', 'railway', 'station', 'track', 'booking'],
    police: ['police', 'crime', 'theft', 'safety', 'security'],
    municipal: ['garbage', 'waste', 'cleaning', 'sanitation', 'park']
  };
  
  Object.entries(keywords).forEach(([tag, words]) => {
    if (words.some(word => text.includes(word))) {
      tags.push(tag);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
} 