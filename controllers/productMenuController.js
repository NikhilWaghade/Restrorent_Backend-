import { supabase } from "../config/supabase.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !description || !price || !category || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          category,
          image_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Product created successfully", product: data });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Failed to get product", error: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from("products")
      .update({ name, description, price, category, image_url, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ message: "Product updated successfully", product: data });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// ✅ Add Review to Product
export const addReviewToProduct = async (req, res) => {
  const { id } = req.params; // Product ID
  const { user, rating, comment } = req.body;

  if (!user || !rating || !comment) {
    return res.status(400).json({ message: "User, rating, and comment are required" });
  }

  try {
    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (productError || !product) return res.status(404).json({ message: "Product not found" });

    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: id,
          user: user,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (reviewError) throw reviewError;

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};
