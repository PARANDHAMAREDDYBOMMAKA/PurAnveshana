import { createServerSupabaseClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    })
    console.log('Fetched profile:', profile)
    return profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  const profile = await getUserProfile(user.id)
  return profile?.role === 'admin'
}
