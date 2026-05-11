import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (user && (user.roles?.includes('admin') || user.roles?.includes('editor'))) {
    return true
  }
  return false
}

export const isAdmin: Access = ({ req: { user } }) => {
  if (user && user.roles?.includes('admin')) {
    return true
  }
  return false
}
