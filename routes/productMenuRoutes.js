import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReviewToProduct,
} from "../controllers/productMenuController.js";

const router = express.Router();

// ✅ Create a new product
router.post("/", createProduct);

// ✅ Get all products
router.get("/", getAllProducts);

// ✅ Get a single product by ID
router.get("/:id", getProductById);

// ✅ Update product by ID
router.put("/:id", updateProduct);

// ✅ Delete product by ID
router.delete("/:id", deleteProduct);

// ✅ Add review to a product
router.post("/:id/reviews", addReviewToProduct);

export default router;
