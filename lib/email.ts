export async function sendPaymentNotificationEmail(
  userEmail: string,
  amount: number,
  paymentMethod: string,
  transactionId?: string
) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email configuration not found. Skipping email notification.')
    return { success: false, message: 'Email configuration not found' }
  }

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background: linear-gradient(to right, #f97316, #f59e0b); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">PurAnveshana</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">पुरातन अन्वेषण</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #15803d; margin-top: 0;">Payment Received!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Congratulations! You have received a payment for your heritage contributions.
        </p>

        <div style="background: #f0fdf4; border-left: 4px solid #15803d; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600;">Amount:</td>
              <td style="padding: 8px 0; color: #15803d; font-size: 24px; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600;">Payment Method:</td>
              <td style="padding: 8px 0; color: #1e293b;">${paymentMethod}</td>
            </tr>
            ${transactionId ? `
            <tr>
              <td style="padding: 8px 0; color: #475569; font-weight: 600;">Transaction ID:</td>
              <td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-size: 12px;">${transactionId}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for your valuable contribution to preserving India's ancient heritage. Your efforts help document and protect our cultural legacy for future generations.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard"
             style="background: linear-gradient(to right, #f97316, #f59e0b); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
            View Dashboard
          </a>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
        <p>This is an automated notification from PurAnveshana</p>
        <p>© ${new Date().getFullYear()} PurAnveshana. All rights reserved.</p>
      </div>
    </div>
  `

  try {
    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"PurAnveshana" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Payment Received - PurAnveshana',
      html: emailBody,
    })

    console.log(`Payment notification email sent to ${userEmail}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return { success: false, message: error.message }
  }
}
