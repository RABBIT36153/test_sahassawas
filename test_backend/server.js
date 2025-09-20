const express = require('express');
const app = express();
const PORT = 3000;

// Middleware สำหรับอ่าน JSON
app.use(express.json());

// Route พื้นฐาน
app.get('/', (req, res) => {
  res.send('Hello API with Express.js 🚀');
});

// ตัวอย่าง API users
app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

// API POST
app.post('/users', (req, res) => {
  const user = req.body;
  res.json({ message: "User created", data: user });
});

// Run server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
