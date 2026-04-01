import { supabase } from "./supabase";


export const signUp = async (email, password, full_name, role = "Admin") => {
	
	const { data: authData, error: authError}	= await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { full_name, role },
		},
	})

	if(authError) throw authError;

	const { data: tableData, error: tableError } = await supabase.from("admin_profiles").insert({
		id: authData.user.id,
		email,
		full_name,
		role,
	});

	if(tableError) return { data: authData, error: tableError };

	return { authData, tableData };
};



// ------------------ LOGIN ------------------
export const signIn = async (email, password) => {
	return await supabase.auth.signInWithPassword({ email, password })

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
	return await supabase.from("admin_profiles").select("*").order("created_at", { ascending: false });
}

export const updateAccountDetails = async (userId, fullName, newPassword) => {
	const updatePayload = {};

	if (fullName?.trim()) {
		updatePayload.data = { full_name: fullName.trim() };
	}

	if (newPassword?.trim()) {
		updatePayload.password = newPassword.trim();
	}

	if (!Object.keys(updatePayload).length) {
		throw new Error("No updates provided");
	}

	const { data: authData, error: authError } = await supabase.auth.updateUser(updatePayload);
	if (authError) throw authError;

	let tableData = null;
	if (updatePayload.data && userId) {
		const { data, error } = await supabase
			.from("admin_profiles")
			.update({ full_name: fullName.trim() })
			.eq("id", userId);
		if (error) throw error;
		tableData = data;
	}

	return { authData, tableData };
};

export const deleteAccount = async (userId) => {
	return await supabase.from("admin_profiles").delete().eq("id", userId);
}

export const getCurrentSession = async () => await supabase.auth.getSession();
export const getCurrentUser = async () => await supabase.auth.getUser();