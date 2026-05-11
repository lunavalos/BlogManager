import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      // @ts-ignore
      Icon: './components/Admin/Icons#MediaIconComponent',
    }
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
