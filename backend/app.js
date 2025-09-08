import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import orderRoutes from './routes/orderRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import categoryRoute from './routes/categoryRoute.js';
import dailyFoodRoutes from './routes/dailyFoodRoutes.js';
import dailyFoodComponentRoutes from './routes/dailyFoodComponentRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- START: PRODUCTION-READY CORS CONFIGURATION ---
// Replace 'https://your-frontend-url.vercel.app' with your actual frontend URL
const allowedOrigins = [
  'https://hacktrail-team-orion-x-cvvr-git-host-ghdbashens-projects.vercel.app', 
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,PATCH,HEAD,OPTIONS',
  credentials: true
};

app.use(cors(corsOptions));
// --- END: PRODUCTION-READY CORS CONFIGURATION ---

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);
app.use('/api/customer', orderRoutes);
app.use('/api/admin', orderRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/admin', dailyFoodRoutes);
app.use('/api/admin', dailyFoodComponentRoutes);
app.use('/api/categories', categoryRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;

