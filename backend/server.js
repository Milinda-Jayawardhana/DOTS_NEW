require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const registerRoute = require("./Route/Register");
const bodyParser = require("body-parser");
const cors = require("cors");
const createAdminAccount = require("./Scripts/Admin");
const loginRoute = require("./Route/Login");
const userRoute = require("./Route/User");
const tcolorsRoute = require("./Route/Tcolors");
const tsizesRoute = require("./Route/Tsizes");
const tmaterialsRoute = require("./Route/Tmaterials");
const tcountRoute = require("./Route/Tcount");
const contactRoute = require("./Route/contactUs");
const ttypeRoute = require("./Route/Ttype");
const makeOrderRoute = require("./Route/preorderRoute");
const statsRoute = require("./Route/Stats");
const contactInfoRoute = require("./Route/ContactInfo");
const paymentRoutes = require("./Route/Payments");

const app = express();

// CORS Configuration - UPDATED
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://localhost:3000',
      'https://localhost:5173',
    ];
    
    // Add your actual Vercel frontend URLs here
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push(
        // Replace these with your actual frontend domain(s)
        process.env.FRONTEND_URL,
        'https://dots-new-frontend.vercel.app', // Replace with your actual frontend URL
        // Add more frontend domains if you have multiple deployments
      );
    } else {
      // In development, be more permissive
      return callback(null, true);
    }
    
    console.log('Checking origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware (AFTER CORS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.get('origin'));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Import and use routes
app.use("/user", registerRoute); // registration-related routes
app.use("/auth", loginRoute); // login-related routes
app.use("/api", userRoute); // user-related routes
app.use("/api", tcolorsRoute); // color-related routes
app.use("/api", tsizesRoute); // size-related routes
app.use("/api", tmaterialsRoute); // material-related routes
app.use("/api", tcountRoute); // count-related routes
app.use("/api", contactRoute); // contact-related routes
app.use("/api", ttypeRoute); // type-related routes
app.use("/api", makeOrderRoute); // order-related routes
app.use("/api", statsRoute); // stats-related routes
app.use("/api", contactInfoRoute); // contact info routes
app.use('/api/payment', paymentRoutes); // payment routes

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DOTS API Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: err.message
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Handle 404 errors
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.path} not found` 
  });
});

// Initialize admin account
createAdminAccount();

// Database connection and server startup
mongoose
  .connect(process.env.DATABASE_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    
    // Only start server if not in production (Vercel handles this)
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`API app running on port ${PORT}`);
      });
    }
    
    console.log("Connected to the MongoDB");
    console.log("Environment:", process.env.NODE_ENV || 'development');
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// Export the app for Vercel
module.exports = app;