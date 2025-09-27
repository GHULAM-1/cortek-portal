import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
  role: string;
  loginUrl: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      const htmlContent = this.generateWelcomeEmailHTML(data);
      const textContent = this.generateWelcomeEmailText(data);

      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: data.email,
        subject: 'Welcome to Cortek Portal - Your Account is Ready',
        html: htmlContent,
        text: textContent,
      });

      console.log(`Welcome email sent successfully to ${data.email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Cortek Portal</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .credentials { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Cortek Portal</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.name},</h2>
              <p>Your account has been created successfully! You now have access to the Cortek Portal with <strong>${data.role}</strong> privileges.</p>

              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Password:</strong> ${data.password}</p>
                <p><strong>Role:</strong> ${data.role}</p>
              </div>

              <p>To get started, click the button below to log into your account:</p>
              <a href="${data.loginUrl}" class="button">Login to Portal</a>

              <p><strong>Important Security Note:</strong> Please change your password after your first login for security purposes.</p>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact your system administrator.</p>
              <p>&copy; 2024 Cortek Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateWelcomeEmailText(data: WelcomeEmailData): string {
    return `
Welcome to Cortek Portal

Hello ${data.name},

Your account has been created successfully! You now have access to the Cortek Portal with ${data.role} privileges.

Your Login Credentials:
- Email: ${data.email}
- Password: ${data.password}
- Role: ${data.role}

Login URL: ${data.loginUrl}

Important Security Note: Please change your password after your first login for security purposes.

If you have any questions, please contact your system administrator.

© 2024 Cortek Portal. All rights reserved.
    `;
  }
}