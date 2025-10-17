import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// import adminRoutes from "./routes/adminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productMenuRoutes.js";



dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
app.use(express.json());

// admin Routes
app.use("/api/auth", adminRoutes);
// productmenu Routes 
app.use('/api/menu', productRoutes);

app.use(errorHandler);


app.get("/", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
