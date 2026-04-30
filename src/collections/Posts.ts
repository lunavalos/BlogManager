import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    components: {
      // @ts-ignore
      Icon: './components/Admin/Icons#PostsIconComponent',
    },
    preview: (doc) => {
      const secret = process.env.PAYLOAD_PUBLIC_DRAFT_SECRET
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL
      if (doc?.slug && secret && frontendUrl) {
        return `${frontendUrl}/api/preview?slug=${doc.slug}&secret=${secret}`
      }
      return null
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description: 'A brief summary of the post for listing pages.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Metadata',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              admin: {
                description: 'Selecciona el usuario que creó este blog.',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'SEO Title (ideal length: 50-60 characters)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: {
                description: 'SEO Description (ideal length: 150-160 characters)',
              },
            },
          ],
        },
      ],
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
                return slugify(data.title, { lower: true, strict: true })
              }
            }
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
