import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');
    const citizenEmail = searchParams.get('email');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    await connectToDatabase();

    // Build MongoDB query
    const mongoQuery: any = {};

    // Text search in title and description
    if (query.trim()) {
      mongoQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { complaintId: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      mongoQuery.category = category;
    }

    // Filter by status
    if (status && status !== 'all') {
      mongoQuery.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      mongoQuery.priority = priority;
    }

    // Filter by department
    if (department && department !== 'all') {
      mongoQuery['department.name'] = { $regex: department, $options: 'i' };
    }

    // Filter by citizen email
    if (citizenEmail) {
      mongoQuery['citizen.email'] = citizenEmail;
    }

    // Date range filter
    if (startDate || endDate) {
      mongoQuery.createdAt = {};
      if (startDate) {
        mongoQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999); // End of day
        mongoQuery.createdAt.$lte = endDateObj;
      }
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute search with pagination
    const [complaints, totalCount] = await Promise.all([
      Complaint.find(mongoQuery)
        .populate('department.id', 'name shortName category')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(mongoQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get search statistics
    const stats = {
      totalResults: totalCount,
      currentPage: page,
      totalPages,
      resultsPerPage: limit,
      hasNextPage,
      hasPrevPage
    };

    // Get category breakdown for current search
    const categoryBreakdown = await Complaint.aggregate([
      { $match: mongoQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get status breakdown for current search
    const statusBreakdown = await Complaint.aggregate([
      { $match: mongoQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get priority breakdown for current search
    const priorityBreakdown = await Complaint.aggregate([
      { $match: mongoQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        complaints: complaints.map(complaint => ({
          id: complaint._id,
          complaintId: complaint.complaintId,
          title: complaint.title,
          description: complaint.description.substring(0, 200) + (complaint.description.length > 200 ? '...' : ''),
          category: complaint.category,
          priority: complaint.priority,
          status: complaint.status,
          citizen: {
            name: complaint.citizen.name,
            email: complaint.citizen.email
          },
          department: complaint.department,
          location: complaint.location,
          createdAt: complaint.createdAt,
          updatedAt: complaint.updatedAt,
          tags: complaint.tags,
          hasRating: !!complaint.citizenRating,
          rating: complaint.citizenRating
        })),
        pagination: stats,
        breakdowns: {
          categories: categoryBreakdown.map(item => ({
            category: item._id,
            count: item.count
          })),
          statuses: statusBreakdown.map(item => ({
            status: item._id,
            count: item.count
          })),
          priorities: priorityBreakdown.map(item => ({
            priority: item._id,
            count: item.count
          }))
        },
        searchQuery: {
          query,
          category,
          status,
          priority,
          department,
          citizenEmail,
          startDate,
          endDate,
          sortBy,
          sortOrder
        }
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error searching complaints:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to search complaints',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      filters,
      sort,
      pagination
    } = body;

    await connectToDatabase();

    // Build advanced search query
    const mongoQuery: any = {};

    // Advanced text search
    if (query?.text) {
      mongoQuery.$text = { $search: query.text };
    }

    // Complex filters
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        mongoQuery.category = { $in: filters.categories };
      }

      if (filters.statuses && filters.statuses.length > 0) {
        mongoQuery.status = { $in: filters.statuses };
      }

      if (filters.priorities && filters.priorities.length > 0) {
        mongoQuery.priority = { $in: filters.priorities };
      }

      if (filters.departments && filters.departments.length > 0) {
        mongoQuery['department.name'] = { $in: filters.departments };
      }

      if (filters.dateRange) {
        mongoQuery.createdAt = {};
        if (filters.dateRange.start) {
          mongoQuery.createdAt.$gte = new Date(filters.dateRange.start);
        }
        if (filters.dateRange.end) {
          mongoQuery.createdAt.$lte = new Date(filters.dateRange.end);
        }
      }

      if (filters.hasRating !== undefined) {
        if (filters.hasRating) {
          mongoQuery.citizenRating = { $exists: true, $ne: null };
        } else {
          mongoQuery.citizenRating = { $exists: false };
        }
      }

      if (filters.ratingRange) {
        mongoQuery.citizenRating = {
          $gte: filters.ratingRange.min || 1,
          $lte: filters.ratingRange.max || 5
        };
      }
    }

    // Sorting
    const sortObj: any = {};
    if (sort) {
      sortObj[sort.field] = sort.direction === 'asc' ? 1 : -1;
    } else {
      sortObj.createdAt = -1; // Default sort
    }

    // Pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;

    // Execute advanced search
    const [complaints, totalCount] = await Promise.all([
      Complaint.find(mongoQuery)
        .populate('department.id', 'name shortName category')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(mongoQuery)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        complaints,
        pagination: {
          totalResults: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          resultsPerPage: limit
        }
      },
      query: {
        text: query?.text,
        filters,
        sort,
        pagination
      }
    });

  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to perform advanced search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 