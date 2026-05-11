import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    components: {
      // @ts-ignore
      Icon: './components/Admin/Icons#CategoriesIconComponent',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' || !data?.slug) {
              if (data?.title) {
                return data.title
                  .toLowerCase()
                  .replace(/ /g, '-')
                  .replace(/[^\w-]+/g, '')
              }
            }
            return data?.slug
          },
        ],
      },
    },
  ],
}
