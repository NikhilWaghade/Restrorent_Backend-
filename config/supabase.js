import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


// export async function testConnection() {
//   try {
   
//     const { data, error } = await supabase
//       .from('') 
//       .select('*')
//       .limit(1);

//     if (error) {
//       console.error("Supabase connection error:", error.message);
//     } else {
//       console.log("Supabase connected successfully! ");
//     }
//   } catch (err) {
//     console.error("Unexpected error:", err.message);
//   }
// }

export default supabase;