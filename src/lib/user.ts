import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  return await currentUser();
}

export async function getCurrentUserId() {
  const user = await currentUser();
  return user?.id;
}

// Helper function to get Supabase user ID from Clerk user ID
export async function getSupabaseUserId() {
  const user = await currentUser();
  if (!user) return null;

  // In a real implementation, you would map Clerk user ID to Supabase user ID
  // For now, we'll return the Clerk user ID as a placeholder
  return user.id;
}
