import nodemailer from 'nodemailer';

interface NotificationData {
  complaintId: string;
  status: string;
  note: string;
  citizenName: string;
  departmentName: string;
}

// Email notification service
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmailNotification(
  email: string,
  data: NotificationData
): Promise<boolean> {
  try {
    const statusMessages = {
      new: 'Your complaint has been received and is being processed.',
      under_review: 'Your complaint is currently under review by our team.',
      in_progress: 'We are actively working on resolving your complaint.',
      resolved: 'Great news! Your complaint has been resolved.',
      closed: 'Your complaint has been closed.'
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .complaint-id { background: #f0f7ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .status.resolved { background: #dcfce7; color: #166534; }
            .status.in_progress { background: #fef3c7; color: #92400e; }
            .status.under_review { background: #fef3c7; color: #92400e; }
            .status.new { background: #dbeafe; color: #1e40af; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏛️ SevaLink - सेवालिंक</h1>
            <p>Government of Bihar | Complaint Update</p>
          </div>
          
          <div class="content">
            <h2>Dear ${data.citizenName},</h2>
            
            <p>We have an update regarding your complaint:</p>
            
            <div class="complaint-id">
              <strong>Complaint ID:</strong> ${data.complaintId}<br>
              <strong>Department:</strong> ${data.departmentName}<br>
              <strong>New Status:</strong> <span class="status ${data.status}">${data.status.replace('_', ' ')}</span>
            </div>
            
            <p><strong>Update:</strong> ${data.note}</p>
            
            <p>${statusMessages[data.status as keyof typeof statusMessages]}</p>
            
            <p>You can track your complaint anytime at: 
              <a href="${process.env.APP_URL}/complaints/track?id=${data.complaintId}">
                Track Complaint
              </a>
            </p>
            
            <p>Thank you for using SevaLink.</p>
          </div>
          
          <div class="footer">
            <p>SevaLink - Connecting Citizens to Government Services</p>
            <p>Government of Bihar | Digital India Initiative</p>
            <p>For support: help@sevalink.gov.in | +91-612-2234567</p>
          </div>
        </body>
      </html>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@sevalink.gov.in',
      to: email,
      subject: `SevaLink: Complaint ${data.complaintId} - Status Update`,
      html: emailHtml,
    });

    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

// SMS notification service (TextLocal API)
export async function sendSMSNotification(
  phone: string,
  data: NotificationData
): Promise<boolean> {
  try {
    const message = `SevaLink Update: Your complaint ${data.complaintId} status changed to ${data.status.toUpperCase()}. ${data.note} Track at: ${process.env.APP_URL}/complaints/track?id=${data.complaintId}`;

    // For demo purposes, we'll log the SMS instead of actually sending
    // In production, integrate with TextLocal API
    console.log(`📱 SMS to ${phone}: ${message}`);
    
    // Actual TextLocal integration would look like:
    // const response = await fetch('https://api.textlocal.in/send/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     apikey: process.env.TEXTLOCAL_API_KEY!,
    //     numbers: phone,
    //     message: message,
    //     sender: process.env.TEXTLOCAL_SENDER || 'SEVALK'
    //   })
    // });

    return true;
  } catch (error) {
    console.error('SMS notification error:', error);
    return false;
  }
}

// Combined notification service
export async function sendNotifications(
  email: string,
  phone: string,
  data: NotificationData
): Promise<{ email: boolean; sms: boolean }> {
  const results = await Promise.allSettled([
    sendEmailNotification(email, data),
    sendSMSNotification(phone, data)
  ]);

  return {
    email: results[0].status === 'fulfilled' ? results[0].value : false,
    sms: results[1].status === 'fulfilled' ? results[1].value : false
  };
} 