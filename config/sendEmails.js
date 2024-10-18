import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: process.env.EMAILPORT,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY,
  },
});

const sendForgotPasswordEmail = async (userAddress, link) => {
  let error = false;

  try {
    await transporter.sendMail({
      from: process.env.SEND_EMAIL,
      to: userAddress,
      subject: "Reset Your Password",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Your Password</title>
            <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                text-align: center;
            }

            h2 {
                color: #0073e6;
                font-size: 24px;
                margin-bottom: 20px;
            }

            p {
                font-size: 16px;
                color: #333;
            }

            .reset-button {
                background-color: #28a745;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 30px;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                transition: background-color 0.3s ease, box-shadow 0.3s ease;
            }

            .reset-button:hover {
                background-color: #218838;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #888;
            }

            @media only screen and (max-width: 600px) {
                .container {
                margin: 20px;
                }
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h2>Reset Your Password</h2>
            <p>Click the button below to reset your password. This link will expire in 20 minutes.</p>

            <p>
                <a
                href="${link}"
                class="reset-button"
                >Reset Password</a
                >
            </p>

            <p class="footer">If you didn't request a password reset, please ignore this email.</p>
            </div>
        </body>
        </html>`,
    });
  } catch (e) {
    console.error("error",e);
    
    error = true;
  }

  return error;
};

export { sendForgotPasswordEmail };
