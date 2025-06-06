import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Department from '@/models/Department';

interface TimelineEntry {
  status: string;
  timestamp: Date;
  note: string;
  updatedBy?: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    await connectToDatabase();

    // Get overall statistics
    const [
      totalComplaints,
      resolvedComplaints,
      activeComplaints,
      newComplaints,
      inProgressComplaints,
      underReviewComplaints
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: { $in: ['new', 'under_review', 'in_progress'] } }),
      Complaint.countDocuments({ status: 'new' }),
      Complaint.countDocuments({ status: 'in_progress' }),
      Complaint.countDocuments({ status: 'under_review' })
    ]);

    // Get recent complaints for resolution time calculation
    const recentResolvedComplaints = await Complaint.find({
      status: 'resolved',
      createdAt: { $gte: startDate }
    }).select('createdAt timeline').lean();

    // Calculate average resolution time
    let avgResolutionHours = 0;
    if (recentResolvedComplaints.length > 0) {
      const totalHours = recentResolvedComplaints.reduce((sum, complaint) => {
        const resolvedEntry = complaint.timeline.find((t: TimelineEntry) => t.status === 'resolved');
        if (resolvedEntry) {
          const created = new Date(complaint.createdAt);
          const resolved = new Date(resolvedEntry.timestamp);
          const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      avgResolutionHours = Math.round(totalHours / recentResolvedComplaints.length);
    }

    // Get department statistics
    const departments = await Department.find({ isActive: true }).lean();
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const [total, resolved] = await Promise.all([
          Complaint.countDocuments({ 'department.id': dept._id }),
          Complaint.countDocuments({ 'department.id': dept._id, status: 'resolved' })
        ]);

        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100 * 10) / 10 : 0;

        // Get recent complaints for this department to calculate avg response time
        const recentDeptComplaints = await Complaint.find({
          'department.id': dept._id,
          status: 'resolved',
          createdAt: { $gte: startDate }
        }).select('createdAt timeline').lean();

        let avgResponseTime = dept.responseTime || 24; // Default from department
        if (recentDeptComplaints.length > 0) {
          const totalHours = recentDeptComplaints.reduce((sum, complaint) => {
            const resolvedEntry = complaint.timeline.find((t: TimelineEntry) => t.status === 'resolved');
            if (resolvedEntry) {
              const created = new Date(complaint.createdAt);
              const resolved = new Date(resolvedEntry.timestamp);
              const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
              return sum + hours;
            }
            return sum;
          }, 0);
          avgResponseTime = Math.round(totalHours / recentDeptComplaints.length);
        }

        return {
          name: dept.name,
          shortName: dept.shortName,
          category: dept.category,
          total,
          resolved,
          active: total - resolved,
          resolutionRate,
          avgResponseTime
        };
      })
    );

    // Get category breakdown
    const categories = [
      'electricity', 'water', 'railways', 'roads', 
      'municipal', 'police', 'health', 'education', 'other'
    ];

    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await Complaint.countDocuments({ category });
        const percentage = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100 * 10) / 10 : 0;
        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count,
          percentage
        };
      })
    );

    // Get monthly trends for the last 6 months
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const [monthComplaints, monthResolved] = await Promise.all([
        Complaint.countDocuments({
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }),
        Complaint.countDocuments({
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'resolved'
        })
      ]);

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        complaints: monthComplaints,
        resolved: monthResolved,
        resolutionRate: monthComplaints > 0 ? Math.round((monthResolved / monthComplaints) * 100) : 0
      });
    }

    // Get priority distribution
    const priorityStats = await Promise.all([
      'low', 'medium', 'high', 'urgent'
    ].map(async (priority) => {
      const count = await Complaint.countDocuments({ priority });
      return {
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        count,
        percentage: totalComplaints > 0 ? Math.round((count / totalComplaints) * 100 * 10) / 10 : 0
      };
    }));

    // Get recent activity
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('complaintId title category status createdAt citizen.name')
      .lean();

    // Calculate resolution rate
    const overallResolutionRate = totalComplaints > 0 ? 
      Math.round((resolvedComplaints / totalComplaints) * 100 * 10) / 10 : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          resolvedComplaints,
          activeComplaints,
          newComplaints,
          inProgressComplaints,
          underReviewComplaints,
          resolutionRate: overallResolutionRate,
          avgResolutionTime: avgResolutionHours
        },
        departments: departmentStats.sort((a, b) => b.total - a.total),
        categories: categoryStats.filter(c => c.count > 0).sort((a, b) => b.count - a.count),
        monthlyTrends,
        priorityStats,
        recentActivity: recentComplaints.map(complaint => ({
          id: complaint.complaintId,
          title: complaint.title,
          category: complaint.category,
          status: complaint.status,
          citizenName: complaint.citizen.name,
          createdAt: complaint.createdAt
        }))
      },
      generatedAt: new Date().toISOString(),
      timeframe: `${timeframe} days`
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 