import { supabase } from './supabase';
import { goto } from '$app/navigation';

export async function signUp(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});
	return { data, error };
}

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	return { data, error };
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (!error) {
		goto('/');
	}
	return { error };
}

export async function getCurrentUser() {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	return { user, error };
}

export function getSession() {
	return supabase.auth.getSession();
}

