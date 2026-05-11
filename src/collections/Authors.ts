import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    hidden: true,
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
