import { supabase } from "./supabase";

export const getReviewer = async () => {
	return await supabase.from('reviewers').select('*').order('created_at', { ascending: false });
}

export const insertReviewer = async (content, file_path, file_size, file_type) => {
	return await supabase.from('reviewers').insert({
		content,
		file_path,
		file_size,
		file_type
	});
}

export const deleteReviewer = async (id) => {
	return await supabase.from('reviewers').delete().eq('id', id);
}

export const uploadFile = async (filePath, file) => {
	return await supabase.storage.from('reviewer_attachment').upload(filePath, file);
}

export const getFileUrl = async (filePath) => {
	return await supabase.storage.from('reviewer_attachment').getPublicUrl(filePath);
}

export const deleteFile = async (filePath) => {
	return await supabase.storage.from('reviewer_attachment').remove([filePath]);
}

export const updateReviewer = async (id, fields) => {
	return await supabase.from('reviewers').update(fields).eq('id', id);
}


  
