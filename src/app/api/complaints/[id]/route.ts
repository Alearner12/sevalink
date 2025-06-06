import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { sendNotifications } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaintId = params.id;

    await connectToDatabase();

    const complaint = await Complaint.findOne({ complaintId })
      .populate('department.id', 'name shortName email phone responseTime');

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      complaint,
      timeline: complaint.timeline,
      currentStatus: complaint.status,
      department: complaint.department
    });

  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaintId = params.id;
    const body = await request.json();
    const { status, note, updatedBy } = body;

    if (!status || !note) {
      return NextResponse.json(
        { error: 'Status and note are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const complaint = await Complaint.findOne({ complaintId })
      .populate('department.id', 'name shortName');

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Update status and add to timeline
    complaint.status = status;
    complaint.timeline.push({
      status,
      timestamp: new Date(),
      note,
      updatedBy
    });

    await complaint.save();

    // Send notifications to citizen
    try {
      const notificationData = {
        complaintId: complaint.complaintId,
        status,
        note,
        citizenName: complaint.citizen.name,
        departmentName: complaint.department.name
      };

      const notificationResults = await sendNotifications(
        complaint.citizen.email,
        complaint.citizen.phone,
        notificationData
      );

      console.log('Notification results:', notificationResults);
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint,
      notificationsSent: true
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 