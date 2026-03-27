import { supabase } from "./supabase";

// SIGN UP
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

// LOGIN
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// LOGOUT
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// GET CURRENT USER
export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};