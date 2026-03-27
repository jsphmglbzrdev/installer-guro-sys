import { supabase } from "./supabase";

export const getReviewer = async () => {
	return await supabase.from('reviewers').select('*').single();
}

export const insertReviewer = async (title, description, file_path) => {
	return await supabase.from('reviewers').insert({
		title,
		description,
		file_path,
	});
}

export const deleteReviewer = async (id) => {
	return await supabase.from('reviewers').delete().eq('id', id);
}

export const uploadFile = async (filePath, file) => {
	return await supabase.storage.from('reviewer_attachment').upload(filePath, file);
}

export const getFileUrl = async (filePath) => {
	const { data } = supabase.storage.from('reviewer_attachment').getPublicUrl(filePath);
	return data.publicUrl;
}

export const deleteFile = async (filePath) => {
	return await supabase.storage.from('reviewer_attachment').remove([filePath]);
}


  
