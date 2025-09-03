import supabase from "../config/supabase.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price, category, image_url: imageUrl }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        reviews (*)
      `);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        reviews (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Product not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        category,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete product first, reviews are cascade deleted in SQL if set
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add review to a product
export const addReviewToMenu = async (req, res) => {
  const { id } = req.params; // product ID
  const { user, rating, comment } = req.body;

  if (!user || !rating || !comment) {
    return res.status(400).json({ message: "Please provide user, rating, and comment." });
  }

  try {
    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: id,
          user_name: user,
          rating,
          comment,
        },
      ])
      .select()
      .single();

    if (reviewError) throw reviewError;

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error while adding review" });
  }
};
