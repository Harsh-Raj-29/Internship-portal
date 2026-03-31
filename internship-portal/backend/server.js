const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files ← ADD THIS
app.use(express.static('../frontend'));

app.get('/', (req, res) => {
  res.json({ message: 'Internship Portal API is running!' });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const internshipRoutes = require('./routes/internships');
app.use('/api/internships', internshipRoutes);

const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Upload Routes
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);


// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
});










// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// require('dotenv').config();
// const app = express();
// //app.use(cors());
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// //

// // Serve frontend files
// app.use(express.static('../frontend'));

// //
// app.get('/', (req, res) => {
//   res.json({ message: 'Internship Portal API is running!' });
// });
// // Auth Routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// const internshipRoutes = require('./routes/internships');
// app.use('/api/internships', internshipRoutes);

// // Application Routes
// const applicationRoutes = require('./routes/applications');
// app.use('/api/applications', applicationRoutes);

// // Profile Routes
// const profileRoutes = require('./routes/profile');
// app.use('/api/profile', profileRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB Connected');
//     app.listen(process.env.PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log('❌ MongoDB connection failed:', err.message);
// });