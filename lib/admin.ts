export function isAdmin(userId: string): boolean {
  const admins = (process.env.ADMIN_USER_IDS || '').split(',').map((id) => id.trim())
  return admins.includes(userId)
}
