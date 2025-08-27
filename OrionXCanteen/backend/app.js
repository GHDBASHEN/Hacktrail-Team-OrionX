import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import orderRoutes from './routes/orderRoutes.js'; // Uncomment when order routes are implemented
import foodRoutes from './routes/foodRoutes.js'; // Dynamic import for food routes
import categoryRoute from './routes/categoryRoute.js'; // Dynamic import for category routes
import menuRoutes from './routes/menuRoutes.js';
import dailyFoodRoutes from './routes/dailyFoodRoutes.js';
import dailyFoodComponentRoutes from './routes/dailyFoodComponentRoutes.js';




const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);

//order routes
app.use('/api/orders',orderRoutes); // Uncomment when order routes are implemented
app.use('/api/foods', foodRoutes); // Dynamic import for food routes
app.use('/api/admin',dailyFoodRoutes);
app.use('/api/admin',dailyFoodComponentRoutes)
app.use('/api/categories', categoryRoute); // Dynamic import for category routes
app.use('/api/menu', menuRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});




export default app;