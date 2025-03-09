import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from "helmet";
import compression from 'compression';


dotenv.config(); // Load environment variables

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression()); // ✅ Enable gzip compression


// ✅ Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ✅ Use a Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // ✅ Prevent SSL issues
  },
});

// ✅ Email Sending Function
async function sendConfirmationEmail(email, fullName, mobileNumber) {
  const mailOptions = {
    from: `"HackGenX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Registration Successful - Hackathon!',
    html: `
      <h2>Hello ${fullName},</h2>
      <p>Thank you for registering for our hackathon! Here are your details:</p>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Mobile:</strong> ${mobileNumber}</li>
      </ul>
      <p>We look forward to seeing you there! 🚀</p>
      <p><strong>Regards,</strong><br>HackGenX Team</p>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// ✅ Test API
app.get('/', (req, res) => {
  res.send('API is working!');
});

// ✅ Register User & Send Email
app.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      collegeName,
      branch,
      city,
      problemStatement,
      reasonForParticipation,
    } = req.body;

    if (!fullName || !email || !mobileNumber) {
      return res.status(400).json({ error: 'Full Name, Email, and Mobile Number are required.' });
    }

    // ✅ Save to database
    const registerData = await prisma.registerData.create({
      data: {
        fullName,
        mobileNumber,
        email,
        collegeName,
        branch,
        city,
        problemStatement,
        reasonForParticipation,
      },
    });

    // ✅ Send confirmation email
    const emailSent = await sendConfirmationEmail(email, fullName, mobileNumber);
    if (!emailSent) {
      return res.status(500).json({ error: 'Registration successful, but email failed to send.' });
    }

    console.log(registerData, 'data');
    res.status(201).json({
      data: registerData,
      message: 'Registration successful! Thank you for registering for the hackathon.',
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all Registrations
app.get('/registrations', async (req, res) => {
  try {
    const registrations = await prisma.registerData.findMany();
    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
