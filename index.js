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
var errorMessage = ''

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

// ✅ Generate Unique Team ID (like HGX-492832)
function generateTeamId() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
    return `HGX-${randomNumber}`;
}

// ✅ Email Sending Function
async function sendConfirmationEmail(email, fullName, mobileNumber, teamName, teamSize, problemStatement, teamId) {
    const mailOptions = {
        from: `"HackGenX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Registration Confirmation - HackGenX Hackathon 2025',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
        <h2 style="color: #4CAF50;">🎉 Thank you for registering for HackGenX Hackathon 2025!</h2>
        <p>Hello <b>${fullName}</b>,</p>
        <p>We are thrilled to inform you that your team <b>${teamName}</b> (${teamSize}) has been successfully registered for <b>HackGenX 2025</b>.</p>

        <h3>📜 <u>Registration Details</u></h3>
        <p><strong>Registration Number:</strong> <b>${teamId}</b></p>
        <p><strong>Problem Statement Selected:</strong> ${problemStatement}</p>

        <h3>📝 Next Steps:</h3>
        <p>1. <b>Screening Round (Online):</b> Prepare your detailed solution proposal for the selected problem statement. This is crucial for being shortlisted for the final round.</p>
        <p>2. <b>Submission Deadline:</b> Ensure you submit your proposal before <b>March 25, 2025</b>. Late submissions will not be considered.</p>
        <p>3. <b>Submission Process:</b> Send your presentation (PPT) to <a href="mailto:hackgenxx@gmail.com">hackgenxx@gmail.com</a> with the subject line: <i>"Screening Round - ${teamId} - ${teamName}"</i></p>
        <p>4. <b>Announcement:</b> Shortlisted teams will be notified via email by <b>[Date]</b>.</p>

        <h3>📅 Important Dates:</h3>
        <ul>
            <li><b>Submission Deadline:</b> March 25, 2025</li>
            <li><b>Results Announcement:</b> [Insert Date]</li>
            <li><b>Final Round:</b> April 2nd - 3rd, 2025</li>
        </ul>

        <h3>📢 How You'll Be Notified:</h3>
        <p>We will notify the finalists via:</p>
        <ul>
            <li>Email to the Team Leader.</li>
            <li>Official Website Announcement.</li>
            <li>Direct Phone Call to the Team Leader.</li>
        </ul>

        <h3>💬 Need Assistance?</h3>
        <p>If you have any questions, feel free to contact us:</p>
        <ul>
            <li>Email: <a href="mailto:hackgenxx@gmail.com">hackgenxx@gmail.com</a></li>
            <li>Phone: +919307959202, +919021606508</li>
            <li>Website: <a href="http://hackgenx.ipapo.in" target="_blank">http://hackgenx.ipapo.in</a></li>
        </ul>

        <hr>
        <p style="color: #666; font-size: 12px;">Best Regards,<br><strong>The HackGenX Team</strong></p>
        </div>
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

// ✅ Register API
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
            teamName,
            teamSize
        } = req.body;

        if (!fullName || !email || !mobileNumber || !teamName) {
            return res.status(400).json({
                error: true,
                message: 'Full Name, Email, Mobile Number, and Team Name are required.'
            });
        }

        // ✅ Generate a Unique Team ID
        let teamId = generateTeamId();
        // let isUnique = false;

        // // ✅ Ensure the Team ID is Unique
        // while (!isUnique) {
        //     const existingTeam = await prisma.registerData.findUnique({
        //         where: { email: email }
        //     });

        //     if (!existingTeam) {
        //         isUnique = true;
        //     } else {
        //         teamId = generateTeamId(); // Generate again if already exists
        //     }
        // }


        let isUnique = false;

        while (!isUnique) {
            // Check if email already exists
            const existingEmail = await prisma.registerData.findUnique({
                where: { email: email }
            });
        
            // Check if teamName already exists
            const existingTeamName = await prisma.registerData.findUnique({
                where: { teamName: teamName }
            });
        
            if (existingEmail) {
                errorMessage = "Email already exists. Please use another email";
                console.log("❌ Email already exists. Please use another email.");
                break;
            }
        
            if (existingTeamName) {
                errorMessage = " Team name already exists. Please choose another team name"
                console.log("❌ Team name already exists. Please choose another team name.");
                break;
            }
        
            // If both are unique, mark as true
            isUnique = true;
        }
        


        // ✅ Save to Database
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
                teamName,
                teamSize,
                teamId
            }
        });

        // ✅ Send Confirmation Email
        const emailSent = await sendConfirmationEmail(
            email,
            fullName,
            mobileNumber,
            teamName,
            teamSize,
            problemStatement,
            teamId
        );

        if (!emailSent) {
            return res.status(500).json({
                error: true,
                message: 'Registration successful, but email failed to send.'
            });
        }

        res.status(201).json({
            error: false,
            message: 'Registration successful! Thank you for registering for the hackathon.',
            data: registerData
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: true,
                message: errorMessage
            });
        }

        console.error('❌ Registration Error:', error);
        res.status(500).json({
            error: true,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// ✅ Get All Registrations
// ✅ Get All Registrations
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
