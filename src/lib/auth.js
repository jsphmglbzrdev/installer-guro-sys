import { supabase } from "./supabase";

// ------------------ SIGN UP ------------------
export const signUp = async (email, password, full_name, role = "Admin") => {
  try {
    // 1️⃣ Sign up user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }, // stored in user_metadata
      },
    });

    if (signUpError) throw signUpError;

    const userId = authData.user.id;

    // 2️⃣ Insert profile into admin_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("admin_profiles")
      .insert([
        {
          id: userId,
          email,
          full_name,
          role, // store role in your table
        },
      ]);

    if (profileError) {
      // Optional: delete auth user if profile insert fails
      await supabase.auth.admin.deleteUser(userId);
      throw profileError;
    }

    return { authData, profileData };
  } catch (err) {
    console.error("SignUp Error:", err);
    throw err;
  }
};

// ------------------ LOGIN ------------------
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("SignIn Error:", err);
    throw err;
  }
};

// ------------------ LOGOUT ------------------
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error("SignOut Error:", err);
    throw err;
  }
};

export const fetchAllAdminAccounts = async () => {
	return await supabase.from("admin_profiles").select("*");
}