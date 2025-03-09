import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// Test API
app.get('/', (req, res) => {
  res.send('API is working!');
});

// ✅ Create a new Name
app.post('/add-name', async (req, res) => {
  try {
    const { firstName, lastName, middleName } = req.body;
    const name = await prisma.name.create({
      data: {
        firstName,
        lastName,
        middleName,
      },
    });
    res.status(201).json(name);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all Names
app.get('/names', async (req, res) => {
  try {
    const names = await prisma.name.findMany();
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Create RegisterData
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

    console.log(registerData , "data");
    res.status(201).json(registerData);
  } catch (error) {
    console.log(error , "error")
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all RegisterData
app.get('/registrations', async (req, res) => {
  try {
    const registrations = await prisma.registerData.findMany();
    res.status(200).json(registrations);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

// ✅ Connect Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
