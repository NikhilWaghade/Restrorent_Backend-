import bcrypt from "bcryptjs";
import supabase from "../config/supabase.js";


export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Check if admin already exists
    const { data: existingAdmin, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // ✅ returns null if not found

    if (fetchError) {
      console.error("Error checking admin:", fetchError.message);
      return res.status(500).json({ message: "Error checking admin" });
    }

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert new admin
    const { data: newAdmin, error: insertError } = await supabase
      .from("admins")
      .insert([{ name, email, password: hashedPassword }])
      .select("*")
      .maybeSingle();

    if (insertError) {
      console.error("Insert Error:", insertError.message);
      return res.status(500).json({ message: "Error inserting admin" });
    }

    res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 1️⃣ Find admin by email
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (fetchError || !admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};