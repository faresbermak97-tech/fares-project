import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import DOMPurify from 'isomorphic-dompurify';
import rateLimit from 'express-rate-limit';

// Rate limiting configuration
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

// Helper function to log server errors without exposing to client
const logServerError = (error: unknown, context: string): void => {
  const timestamp = new Date().toISOString();
  const errorDetails = error instanceof Error ? error.stack : String(error);
  console.error(`[${timestamp}] ${context}: ${errorDetails}`);
};

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    // Note: In production, you might want to use a proper rate limiting solution
    // that works with Next.js API routes, like using a database or Redis
    const ip = request.ip || 'unknown';

    // Check if we have rate limiting data for this IP
    // This is a simplified in-memory implementation
    // In production, use a proper rate limiting solution
    const rateLimitKey = `rate_limit_${ip}`;
    const now = Date.now();
    const windowStart = now - (60 * 60 * 1000); // 1 hour ago

    // Get existing rate limit data from headers (simplified approach)
    const rateLimitData = JSON.parse(request.headers.get('x-rate-limit-data') || '{}');

    // Filter out old requests
    const recentRequests = rateLimitData.requests?.filter((timestamp: number) => timestamp > windowStart) || [];

    // Check if rate limit exceeded
    if (recentRequests.length >= 5) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { 
          status: 429, 
          headers: { 
            'Cache-Control': 'no-store, must-revalidate',
            'Retry-After': '3600' // 1 hour
          } 
        }
      );
    }

    // Add current request to the list
    recentRequests.push(now);

    // Get and validate the input
    const { name, email, message } = await request.json();

    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }

    // Validate name length
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }

    // Validate message length
    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedName = DOMPurify.sanitize(name.trim());
    const sanitizedEmail = DOMPurify.sanitize(email.trim());
    const sanitizedMessage = DOMPurify.sanitize(message.trim());

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add security settings
      tls: {
        rejectUnauthorized: true
      }
    });

    // Email options for admin
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'faresbermak97@gmail.com',
      subject: `New Contact Form Submission from ${sanitizedName}`,
      text: `
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        Message: ${sanitizedMessage}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${sanitizedName}</p>
            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${sanitizedEmail}</p>
            <p style="margin: 0 0 10px;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${sanitizedMessage}</p>
          </div>
        </div>
      `,
    };

    // Send the email to admin
    await transporter.sendMail(mailOptions);

    // Send a confirmation email to the sender (optional)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: sanitizedEmail,
      subject: 'Thank you for contacting Fares Bermak',
      text: `Hi ${sanitizedName},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

Best regards,
Fares Bermak`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Contacting Me</h2>
          <p>Hi ${sanitizedName},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Fares Bermak</p>
        </div>
      `,
    });

    // Return success response with rate limit data for next request
    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully!' 
      },
      { 
        status: 200, 
        headers: { 
          'Cache-Control': 'no-store, must-revalidate',
          'x-rate-limit-data': JSON.stringify({ requests: recentRequests })
        } 
      }
    );
  } catch (error) {
    // Log the detailed error on the server
    logServerError(error, 'Contact form submission error');

    // Return generic error to client
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
    );
  }
}
