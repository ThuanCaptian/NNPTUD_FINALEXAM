require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Kết nối database
require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());

// Static folder để xem ảnh upload
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
    res.send('API Running...');
});

/* ================= ROUTES ================= */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/orderdetails', require('./routes/orderDetailRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

/* =========================================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});