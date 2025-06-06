import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

// Simple in-memory store for notification status (in production, use a proper database)
interface NotificationLog {
  id: string;
  complaintId: string;
  type: 'email' | 'sms';
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  retryCount: number;
}

// This would be stored in a database in production
let notificationLogs: NotificationLog[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const complaintId = searchParams.get('complaintId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectToDatabase();

    // Filter logs based on query parameters
    let filteredLogs = notificationLogs;

    if (complaintId) {
      filteredLogs = filteredLogs.filter(log => log.complaintId === complaintId);
    }

    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type);
    }

    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    // Sort by most recent first and limit results
    const sortedLogs = filteredLogs
      .sort((a, b) => {
        const dateA = a.sentAt || new Date(0);
        const dateB = b.sentAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);

    // Calculate statistics
    const totalLogs = filteredLogs.length;
    const sentCount = filteredLogs.filter(log => log.status === 'sent').length;
    const failedCount = filteredLogs.filter(log => log.status === 'failed').length;
    const pendingCount = filteredLogs.filter(log => log.status === 'pending').length;

    const stats = {
      total: totalLogs,
      sent: sentCount,
      failed: failedCount,
      pending: pendingCount,
      successRate: totalLogs > 0 ? Math.round((sentCount / totalLogs) * 100 * 10) / 10 : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        logs: sortedLogs,
        statistics: stats,
        filters: {
          complaintId,
          type,
          status,
          limit
        }
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching notification status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch notification status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintId, type, recipient, status, error } = body;

    // Validate required fields
    if (!complaintId || !type || !recipient || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: complaintId, type, recipient, status' },
        { status: 400 }
      );
    }

    // Validate type and status
    if (!['email', 'sms'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "email" or "sms"' },
        { status: 400 }
      );
    }

    if (!['pending', 'sent', 'failed'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "pending", "sent", or "failed"' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new notification log entry
    const newLog: NotificationLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      complaintId,
      type: type as 'email' | 'sms',
      recipient,
      status: status as 'pending' | 'sent' | 'failed',
      sentAt: status === 'sent' ? new Date() : undefined,
      error: status === 'failed' ? error : undefined,
      retryCount: 0
    };

    // Add to logs (in production, save to database)
    notificationLogs.push(newLog);

    // Keep only last 1000 logs to prevent memory issues
    if (notificationLogs.length > 1000) {
      notificationLogs = notificationLogs.slice(-1000);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification status logged successfully',
      logId: newLog.id,
      data: newLog
    });

  } catch (error) {
    console.error('Error logging notification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { logId, status, error } = body;

    if (!logId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: logId, status' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and update the log entry
    const logIndex = notificationLogs.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      return NextResponse.json(
        { error: 'Notification log not found' },
        { status: 404 }
      );
    }

    const log = notificationLogs[logIndex];
    log.status = status as 'pending' | 'sent' | 'failed';
    log.sentAt = status === 'sent' ? new Date() : log.sentAt;
    log.error = status === 'failed' ? error : undefined;
    log.retryCount = status === 'failed' ? log.retryCount + 1 : log.retryCount;

    notificationLogs[logIndex] = log;

    return NextResponse.json({
      success: true,
      message: 'Notification status updated successfully',
      data: log
    });

  } catch (error) {
    console.error('Error updating notification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Utility function to add notification logs (can be called from other APIs)
export function addNotificationLog(log: Omit<NotificationLog, 'id'>): string {
  const newLog: NotificationLog = {
    ...log,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  notificationLogs.push(newLog);
  
  // Keep only last 1000 logs
  if (notificationLogs.length > 1000) {
    notificationLogs = notificationLogs.slice(-1000);
  }
  
  return newLog.id;
} 