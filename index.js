// import express from 'express';
// import { PrismaClient } from '@prisma/client';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import helmet from "helmet";
// import compression from 'compression';

// dotenv.config(); // Load environment variables

// const app = express();
// const prisma = new PrismaClient();
// var errorMessage = ''

// app.use(bodyParser.json());
// app.use(cors());
// app.use(helmet());
// app.use(compression()); // ✅ Enable gzip compression

// // ✅ Nodemailer Configuration
// const transporter = nodemailer.createTransport({
//     // service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // ✅ Use a Gmail App Password
//     },
//     tls: {
//         rejectUnauthorized: false, // ✅ Prevent SSL issues
//     },
//     host: "smtp.gmail.com",
//     // host: "smtp.resend.com",
//     port: 465,
//     secure: true,
// });


// // ✅ Generate Unique Team ID (like HGX-492832)
// function generateTeamId() {
//     const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
//     return `HGX-${randomNumber}`;
// }


// // Home Route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to the Home Page!" });
// });





// async function sendConfirmationEmail(email, fullName, mobileNumber, teamName, teamSize, problemStatement, teamId) {
//     const mailOptions = {
//         from: `"HackGenX" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: '✅ Registration Confirmation - HackGenX Hackathon 2025',
//         html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
//         <h2 style="color: #4CAF50;">🎉 Thank you for registering for HackGenX Hackathon 2025!</h2>
//         <p>Hello <b>${fullName}</b>,</p>
//         <p>We are thrilled to inform you that your team <b>${teamName}</b> (${teamSize}) has been successfully registered for <b>HackGenX 2025</b>.</p>

//         <h3>📜 <u>Registration Details</u></h3>
//         <p><strong>Registration Number:</strong> <b>${teamId}</b></p>
//         <p><strong>Problem Statement Selected:</strong> ${problemStatement}</p>

//         <h3>📝 Next Steps:</h3>
//         <p>1. <b>Screening Round (Online):</b> Prepare your detailed solution proposal for the selected problem statement. This is crucial for being shortlisted for the final round.</p>
//         <p>2. <b>Submission Deadline:</b> Ensure you submit your proposal before <b>April 7, 2025</b>. Late submissions will not be considered.</p>
// <p>3. <b>Submission Process:</b> Submit your presentation (PPT) via the following form:
//         <a href="https://docs.google.com/forms/d/e/1FAIpQLSdjzbjNOC2km0slSNK-2TdQkGPi8DZbPqjNlsUWV97OXkhAVA/viewform?usp=header"> Submission Form </a>
//   with the subject line: <i>"Screening Round - ${teamId} - ${teamName}"</i></p>
//         <p>4. <b>Announcement:</b> Shortlisted teams will be notified via email by <b>April 11, 2025</b>.</p>

//         <h3>📅 Important Dates:</h3>
//         <ul>
//             <li><b>Submission Deadline:</b> April 5, 2025</li>
//             <li><b>Final Round:</b> April 16th - 17th, 2025</li>
//             <li><b>Results Announcement:</b>April 17, 2025</li>
//         </ul>

//         <h3>📢 How You'll Be Notified:</h3>
//         <p>We will notify the finalists via:</p>
//         <ul>
//             <li>Email to the Team Leader.</li>
//             <li>Official Website Announcement.</li>
//             <li>Direct Phone Call to the Team Leader.</li>
//         </ul>

//         <h3>💬 Need Assistance?</h3>
//         <p>If you have any questions, feel free to contact us:</p>
//         <ul>
//             <li>Email: <a href="mailto:hackgenxx@gmail.com">hackgenxx@gmail.com</a></li>
//             <li>Phone: +919307959202, +919021606508</li>
//             <li>Website: <a href="https://hackgenx.ipapo.in" target="_blank">https://hackgenx.ipapo.in</a></li>
//         </ul>

//         <hr>
//         <p style="color: #666; font-size: 12px;">Best Regards,<br><strong>The HackGenX Team</strong></p>
//         </div>
//         `,
//     };

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('✅ Email sent:', info.response);
//         return true;
//     } catch (error) {
//         console.error('❌ Email sending failed:', error);
//         return false;
//     }
// }

// // ✅ Register API
// app.post('/register', async (req, res) => {
//     console.log("in register" , "register");
//     try {
//         const {
//             fullName,
//             mobileNumber,
//             email,
//             collegeName,
//             branch,
//             city,
//             problemStatement,
//             reasonForParticipation,
//             teamName,
//             teamSize
//         } = req.body;

//         if (!fullName || !email || !mobileNumber || !teamName) {
//             return res.status(400).json({
//                 error: true,
//                 message: 'Full Name, Email, Mobile Number, and Team Name are required.'
//             });
//         }

//         // ✅ Generate a Unique Team ID
//         let teamId = generateTeamId();
//         // let isUnique = false;

//         // // ✅ Ensure the Team ID is Unique
//         // while (!isUnique) {
//         //     const existingTeam = await prisma.registerData.findUnique({
//         //         where: { email: email }
//         //     });

//         //     if (!existingTeam) {
//         //         isUnique = true;
//         //     } else {
//         //         teamId = generateTeamId(); // Generate again if already exists
//         //     }
//         // }


//         let isUnique = false;

//         while (!isUnique) {
//             // Check if email already exists
//             const existingEmail = await prisma.registerData.findUnique({
//                 where: { email: email }
//             });

//             // Check if teamName already exists
//             const existingTeamName = await prisma.registerData.findUnique({
//                 where: { teamName: teamName }
//             });

//             if (existingEmail) {
//                 errorMessage = "Email already exists. Please use another email";
//                 console.log("❌ Email already exists. Please use another email.");
//                 break;
//             }

//             if (existingTeamName) {
//                 errorMessage = " Team name already exists. Please choose another team name"
//                 console.log("❌ Team name already exists. Please choose another team name.");
//                 break;
//             }

//             // If both are unique, mark as true
//             isUnique = true;
//         }

//         // ✅ Save to Database
//         const registerData = await prisma.registerData.create({
//             data: {
//                 fullName,
//                 mobileNumber,
//                 email,
//                 collegeName,
//                 branch,
//                 city,
//                 problemStatement,
//                 reasonForParticipation,
//                 teamName,
//                 teamSize,
//                 teamId
//             }
//         });

     
//         // ✅ Send Confirmation Email
//         const emailSent = await sendConfirmationEmail(
//             email,
//             fullName,
//             mobileNumber,
//             teamName,
//             teamSize,
//             problemStatement,
//             teamId
//         );

//         if (!emailSent) {
//             return res.status(500).json({
//                 error: true,
//                 message: 'Registration successful, but email failed to send.'
//             });
//         }
//    res.status(201).json({
//             error: false,
//             message: 'Registration successful! Check your email for confirmation.',
//             data: registerData
//         });

//     } catch (error) {
//         if (error.code === 'P2002') {
//             return res.status(400).json({
//                 error: true,
//                 message: errorMessage
//             });
//         }

//         console.error('❌ Registration Error:', error);
//         res.status(500).json({
//             error: true,
//             message: 'Something went wrong. Please try again later.'
//         });
//     }
// });



// async function MasterClassesMail(email, fullName, classes) {
//     const mailOptions = {
//         from: `"HackGenX" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: '🎉 Confirmation of Your Master Class Registration – HackGenX 2025',
//         html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
//             <div style="text-align: center;">
//                 <h2 style="color: #4CAF50; margin-top: 10px;">🎉 Welcome to HackGenX MasterClasses 2025!</h2>
//             </div>

//             <p style="font-size: 16px; color: #333;">Dear <strong>${fullName}</strong>,</p>
//             <p style="font-size: 16px; color: #333;">
//                 Thank you for registering for the Master Class at <strong>HackGenX</strong> – The Ultimate Arena for Innovators! 
//                 We are thrilled to have you onboard for this exciting learning experience.
//             </p>

//             <h3 style="color: #333;">📌 Registration Details:</h3>
//             <ul style="font-size: 16px; color: #555; padding-left: 20px;">
//                 <li><strong>Participant Name:</strong> ${fullName}</li>
//                 <li><strong>Master Class Domain:</strong> ${classes.map(cls => `<b>${cls}</b>`).join(', ')}</li>
//                 <li><strong>Registration Status:</strong> ✅ Confirmed</li>
//             </ul>

//             <h3 style="color: #333;">📅 Event Details:</h3>
//             <ul style="font-size: 16px; color: #555; padding-left: 20px;">
//                 <li><strong>📍 Venue:</strong> Sipna College of Engineering & Technology, In front of Nemani Godown, Badnera Road, Amravati - 444701</li>
//                 <li><strong>📅 HackGenX Registration Period:</strong> March 17 – April 5</li>
//             </ul>

//             <h3 style="color: #333;">⏭️ What’s Next?</h3>
//             <p style="font-size: 16px; color: #333;">
//                 The schedule for your master class in the domain of <strong>${classes.map(cls => `<b>${cls}</b>`).join(', ')}</strong> will be shared via email soon. Stay tuned for updates!
//             </p>

//             <h3 style="color: #333;">🔗 More Information:</h3>
//             <p style="font-size: 16px; color: #333;">
//                 For more details, visit our website: <a href="https://hackgenx.ipapo.in" style="color: #4CAF50; text-decoration: none;"><strong>hackgenx.ipapo.in</strong></a>
//             </p>

//             <h3 style="color: #333;">📩 Need Assistance?</h3>
//             <p style="font-size: 16px; color: #333;">
//                 If you have any queries, feel free to reach out to us at 
//                 <a href="mailto:hackgenxx@gmail.com" style="color: #4CAF50; text-decoration: none;"><strong>hackgenxx@gmail.com</strong></a>.
//             </p>

//             <hr style="border: 1px solid #ddd; margin-top: 20px;">
//             <p style="font-size: 14px; color: #666; text-align: center;">Best Regards, <br><strong>HackGenX Team</strong></p>
//         </div>`,
//     };

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('✅ Email sent:', info.response);
//         return true;
//     } catch (error) {
//         console.error('❌ Email sending failed:', error);
//         return false;
//     }
// }



// app.post('/register-masterclass', async (req, res) => {
//     try {
//         const { fullName, mobileNumber, email, age, city , collegeName, classes, exp  , otherClasses} = req.body;

//         // Validate required fields
//         if (!fullName || !email || !mobileNumber || !classes) {
//             return res.status(400).json({
//                 error: true,
//                 message: 'Full Name, Email, Mobile Number, Age, and Classes are required.'
//             });
//         }

//         // Check if email  already exists
//         const existingUser = await prisma.registerData.findUnique({
//             where: { email: email }
//         });

//         console.log(existingUser ,'user' );

//         // if (existingUser) {
//         //     return res.status(400).json({
//         //         error: true,
//         //         message: 'email already registered!,  please use another email.'
//         //     });
//         // }

//         // Save to Database
//         const registerData = await prisma.registerMasterClass.create({
//             data: { 
//                 fullName, 
//                 mobileNumber, 
//                 email, 
//                 age : age && age.trim() !== "" ? age : 'none',
//                 collegeName ,
//                 city: city || "Unknown", // Provide a default value if city is null
//                 classes, 
//                 exp , 
//                 otherClasses 
//             }
//         });

//         // console.log(/)

//         res.status(201).json({
//             error: false,
//             message: 'Registration successful! Check your email for confirmation.',
//             data: registerData
//         });

//         // Send Confirmation Email
//         const emailSent = await MasterClassesMail(email, fullName, classes);
// console.log(emailSent , "email sent");
//         if (!emailSent) {
//             return res.status(500).json({
//                 error: true,
//                 message: 'Registration successful, but email failed to send.'
//             });
//         }
//     } catch (error) {
//         console.log("in catch block ☆*: .｡. o(≧▽≦)o .｡.:*☆")
//         console.error('❌ Registration Error:', error);


        
//         if (error.code === 'P2002') {
//             return res.status(400).json({
//                 error: true,
//                 message: 'email already registered!,  please use another email.'

//             });
//         }

//         res.status(500).json({
//             error: true,
//             message: 'Something went wrong. Please try again later.'
//         });


//     }
// });


// app.post('/login' , async (req , res)=>{
// const {userName , password} =  req.body;

// try {

//     const existingUser = await prisma.login.findUnique({ where:{userName:userName} });

//     if(!existingUser){ res.status(404).json({ message:'User Not Found' })}

//     if(existingUser.password !== password){
//         res.status(403).json({ message: 'Password Incorrect' })
//     }


//     res.json({
//         data:existingUser , 
//         message: 'Login successful' 
//     })

// }
// catch(error){

//     console.log("❌❌ error occured" , error);
// res.status(500).json ({message:'Internal server error'})

// }

// })

// // ✅ Get All Registrations

// app.get('/getRegistrations', async (req, res) => {
//     try {
//         const registrations = await prisma.registerData.findMany();
//         res.status(200).json(registrations);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// });


// app.get('/getMasterClass', async (req, res) => {
//     try {
//         const registrations = await prisma.registerMasterClass.findMany();
//         res.status(200).json(registrations);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// });


// // ✅ Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on https://localhost:${PORT}`);
// });



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
    // service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ✅ Use a Gmail App Password
    },
    tls: {
        rejectUnauthorized: false, // ✅ Prevent SSL issues
    },
    host: "smtp.gmail.com",
    // host: "smtp.resend.com",
    port: 465,
    secure: true,
});


// ✅ Generate Unique Team ID (like HGX-492832)
function generateTeamId() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
    return `HGX-${randomNumber}`;
}


// Home Route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Home Page!" });
});





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
        <p>2. <b>Submission Deadline:</b> Ensure you submit your proposal before <b>April 7, 2025</b>. Late submissions will not be considered.</p>
        <p>3. <b>Submission Process:</b> Submit your presentation (PPT) via the following form:
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdjzbjNOC2km0slSNK-2TdQkGPi8DZbPqjNlsUWV97OXkhAVA/viewform?usp=header"> Submission Form </a>
  with the subject line: <i>"Screening Round - ${teamId} - ${teamName}"</i></p>
        <p>4. <b>Announcement:</b> Shortlisted teams will be notified via email by <b>April 11, 2025</b>.</p>

        <h3>📅 Important Dates:</h3>
        <ul>
            <li><b>Submission Deadline:</b> April 5, 2025</li>
            <li><b>Final Round:</b> April 16th - 17th, 2025</li>
            <li><b>Results Announcement:</b>April 17, 2025</li>
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
            <li>Website: <a href="https://hackgenx.ipapo.in" target="_blank">https://hackgenx.ipapo.in</a></li>
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
    console.log("in register", "register");
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
            message: 'Registration successful! Check your email for confirmation.',
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



async function MasterClassesMail(email, fullName, classes) {
    const mailOptions = {
        from: `"HackGenX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎉 Confirmation of Your Master Class Registration – HackGenX 2025',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center;">
                <h2 style="color: #4CAF50; margin-top: 10px;">🎉 Welcome to HackGenX MasterClasses 2025!</h2>
            </div>

            <p style="font-size: 16px; color: #333;">Dear <strong>${fullName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">
                Thank you for registering for the Master Class at <strong>HackGenX</strong> – The Ultimate Arena for Innovators! 
                We are thrilled to have you onboard for this exciting learning experience.
            </p>

            <h3 style="color: #333;">📌 Registration Details:</h3>
            <ul style="font-size: 16px; color: #555; padding-left: 20px;">
                <li><strong>Participant Name:</strong> ${fullName}</li>
                <li><strong>Master Class Domain:</strong> ${classes.map(cls => `<b>${cls}</b>`).join(', ')}</li>
                <li><strong>Registration Status:</strong> ✅ Confirmed</li>
            </ul>

            <h3 style="color: #333;">📅 Event Details:</h3>
            <ul style="font-size: 16px; color: #555; padding-left: 20px;">
                <li><strong>📍 Venue:</strong> Sipna College of Engineering & Technology, In front of Nemani Godown, Badnera Road, Amravati - 444701</li>
                <li><strong>📅 HackGenX Registration Period:</strong> March 17 – April 5</li>
            </ul>

            <h3 style="color: #333;">⏭️ What’s Next?</h3>
            <p style="font-size: 16px; color: #333;">
                The schedule for your master class in the domain of <strong>${classes.map(cls => `<b>${cls}</b>`).join(', ')}</strong> will be shared via email soon. Stay tuned for updates!
            </p>

            <h3 style="color: #333;">🔗 More Information:</h3>
            <p style="font-size: 16px; color: #333;">
                For more details, visit our website: <a href="https://hackgenx.ipapo.in" style="color: #4CAF50; text-decoration: none;"><strong>hackgenx.ipapo.in</strong></a>
            </p>

            <h3 style="color: #333;">📩 Need Assistance?</h3>
            <p style="font-size: 16px; color: #333;">
                If you have any queries, feel free to reach out to us at 
                <a href="mailto:hackgenxx@gmail.com" style="color: #4CAF50; text-decoration: none;"><strong>hackgenxx@gmail.com</strong></a>.
            </p>

            <hr style="border: 1px solid #ddd; margin-top: 20px;">
            <p style="font-size: 14px; color: #666; text-align: center;">Best Regards, <br><strong>HackGenX Team</strong></p>
        </div>`,
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



app.post('/register-masterclass', async (req, res) => {
    try {
        const { fullName, mobileNumber, email, age, city, collegeName, classes, exp, otherClasses } = req.body;

        // Validate required fields
        if (!fullName || !email || !mobileNumber || !classes) {
            return res.status(400).json({
                error: true,
                message: 'Full Name, Email, Mobile Number, Age, and Classes are required.'
            });
        }

        // Check if email  already exists
        const existingUser = await prisma.registerData.findUnique({
            where: { email: email }
        });

        console.log(existingUser, 'user');

        // if (existingUser) {
        //     return res.status(400).json({
        //         error: true,
        //         message: 'email already registered!,  please use another email.'
        //     });
        // }

        // Save to Database
        const registerData = await prisma.registerMasterClass.create({
            data: {
                fullName,
                mobileNumber,
                email,
                age: age && age.trim() !== "" ? age : 'none',
                collegeName,
                city: city || 'unknown',
                classes,
                exp,
                otherClasses
            }
        });

        // console.log(/)

        res.status(201).json({
            error: false,
            message: 'Registration successful! Check your email for confirmation.',
            data: registerData
        });

        // Send Confirmation Email
        const emailSent = await MasterClassesMail(email, fullName, classes);
        console.log(emailSent, "email sent");
        if (!emailSent) {
            return res.status(500).json({
                error: true,
                message: 'Registration successful, but email failed to send.'
            });
        }
    } catch (error) {
        console.log("in catch block ☆*: .｡. o(≧▽≦)o .｡.:*☆")
        console.error('❌ Registration Error:', error);



        if (error.code === 'P2002') {
            return res.status(400).json({
                error: true,
                message: 'email already registered!,  please use another email.'

            });
        }

        res.status(500).json({
            error: true,
            message: 'Something went wrong. Please try again later.'
        });


    }
});


app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {

        const existingUser = await prisma.login.findUnique({ where: { userName: userName } });

        if (!existingUser) { res.status(404).json({ message: 'User Not Found' }) }

        if (existingUser.password !== password) {
            res.status(403).json({ message: 'Password Incorrect' })
        }


        res.json({
            data: existingUser,
            message: 'Login successful'
        })

    }
    catch (error) {

        console.log("❌❌ error occured", error);
        res.status(500).json({ message: 'Internal server error' })

    }

})


app.post('/pptStatus', async (req, res) => {
    try {
        const { teamId, pptStatus, pptUpdatedBy, pptRemarks, pptFileUrl } = req.body
        console.log( teamId, pptStatus, pptUpdatedBy, pptRemarks, pptFileUrl   , "all data");

         if (!pptStatus.trim()){
            return res.status(400).json({ error: 'pptStatus cannot be empty' });
        }

        const pptData = await prisma.pPTStatus.create({
            data: {
                teamId,
                pptStatus,
                pptUpdatedBy,
                pptRemarks,
                pptFileUrl
            }
        });

        console.log(pptData)
        res.status(200).json({
            data: pptData
        })
    } catch (error) { 
        console.log('❌❌❌', error)
        res.status(500).json({
            error: error
        })
    }
})


// ✅ Get All Registrations

app.get('/getRegistrations', async (req, res) => {
    try {
        const registrations = await prisma.registerData.findMany();
        res.status(200).json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/getRegistrationByTeamId/:teamId', async (req, res) => {
    console.log("by team id");
    const { teamId } = req.params;

    try {
        const registration = await prisma.registerData.findUnique({
            where: { teamId: teamId }
        });

        if (!registration) {
            return res.status(404).json({ error: 'No registration found for this team ID.' });
        }

        res.status(200).json(registration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/getMasterClass', async (req, res) => {
    try {
        const registrations = await prisma.registerMasterClass.findMany();
        res.status(200).json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



app.patch("/updatePPTStatus", async (req, res) => {
    const { teamId, pptStatus } = req.body;
  
    console.log(req.body , "body shod ✅✅✅✅")
    if (!teamId || pptStatus === undefined) {
      return res.status(400).json({ message: "teamId and pptStatus are required" });
    }
  
    try {
      const updatedData = await prisma.registerData.update({
        where: { teamId },
        data: {
          pptStatus: pptStatus , // store as boolean
        },
      });
  
      res.json({
        message: "PPT status updated successfully in registration data",
        updatedData,
      });
    } catch (error) {
      console.error("Error updating PPT status:", error);
      res.status(500).json({ message: "Failed to update PPT status", error });
    }
  });
  


// // PUT or PATCH request – updating pptStatus only
// app.patch("/updatePPTStatus", async (req, res) => {
//     const { teamId, pptStatus } = req.body;
  
//     if (!teamId || !pptStatus) {
//       return res.status(400).json({ message: "teamId and pptStatus are required" });
//     }
  
//     try {
//       const updatedData = await prisma.registerData.update({
//         where: { teamId },
//         data: { pptStatus },
//       });
  
//       res.json({
//         message: "PPT status updated successfully",
//         updatedData,
//       });
//     } catch (error) {
//       console.error("Error updating PPT status:", error);
//       res.status(500).json({ message: "Failed to update PPT status", error });
//     }
//   });
  

// app.get("/getPPTStatus", async(req, res) => {


//     console.log('ppt status');
//     const { teamId } = req.query; // Get teamId from query params

//     if (!teamId) {
//         return res.status(400).json({ message: "Team ID is required" });
//     }

 
//     // Find the matching team data
//     const teamData = await prisma.pPTStatus.findUnique({
//         where:{
//             teamId
//         }
//     })

//     console.log(teamData , "team data");

//     // If no data found, return fallback values
//     if (!teamData) {
//         return res.json({ status: "Pending", updatedBy: "N/A", remarks: "N/A", fileUrl: "N/A" });
//     }

//     res.json(teamData);
// });






// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on https://localhost:${PORT}`);
});
