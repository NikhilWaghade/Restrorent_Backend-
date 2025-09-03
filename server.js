import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// import adminRoutes from "./routes/adminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productMenuRoutes.js";
import { testConnection } from "./config/supabase.js";



dotenv.config();

testConnection();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// admin Routes
app.use("/api/auth", adminRoutes);
// productmenu Routes 
app.use('/api/menu', productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
