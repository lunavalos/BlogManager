'use client'
import React from 'react'
import { 
  Users as UsersIcon, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  UserCircle 
} from 'lucide-react'

export const UsersIconComponent: React.FC = () => <UsersIcon size={18} />
export const PostsIconComponent: React.FC = () => <FileText size={18} />
export const MediaIconComponent: React.FC = () => <ImageIcon size={18} />
export const CategoriesIconComponent: React.FC = () => <Tag size={18} />
export const AuthorsIconComponent: React.FC = () => <UserCircle size={18} />
