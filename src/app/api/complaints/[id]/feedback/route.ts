import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaintId = params.id;
    const body = await request.json();
    const { rating, feedback, citizenEmail } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!feedback || feedback.trim().length < 10) {
      return NextResponse.json(
        { error: 'Feedback must be at least 10 characters long' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the complaint
    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check if complaint is resolved
    if (complaint.status !== 'resolved') {
      return NextResponse.json(
        { error: 'Feedback can only be provided for resolved complaints' },
        { status: 400 }
      );
    }

    // Verify citizen email
    if (complaint.citizen.email !== citizenEmail) {
      return NextResponse.json(
        { error: 'Unauthorized: Email does not match complaint owner' },
        { status: 403 }
      );
    }

    // Check if feedback already exists
    if (complaint.citizenRating) {
      return NextResponse.json(
        { error: 'Feedback has already been provided for this complaint' },
        { status: 400 }
      );
    }

    // Update complaint with feedback
    complaint.citizenRating = rating;
    complaint.citizenFeedback = feedback.trim();
    
    // Add to timeline
    complaint.timeline.push({
      status: 'feedback_received',
      timestamp: new Date(),
      note: `Citizen provided feedback with ${rating} star rating`
    });

    await complaint.save();

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      rating,
      feedback: complaint.citizenFeedback
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaintId = params.id;

    await connectToDatabase();

    const complaint = await Complaint.findOne({ complaintId })
      .select('citizenRating citizenFeedback status')
      .lean();

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasRating: !!complaint.citizenRating,
      rating: complaint.citizenRating,
      feedback: complaint.citizenFeedback,
      canProvideFeedback: complaint.status === 'resolved' && !complaint.citizenRating
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 