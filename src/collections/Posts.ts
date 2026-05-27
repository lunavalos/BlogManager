import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { isAdminOrEditor } from '../access'

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
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
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
              localized: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              localized: true,
              admin: {
                description: 'A brief summary of the post for listing pages.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
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
              localized: true,
              admin: {
                description: 'SEO Title (ideal length: 50-60 characters)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'SEO Description (ideal length: 150-160 characters)',
              },
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Subtítulo que aparecerá en el newsletter.',
              },
            },
            {
              name: 'emailImage',
              label: 'Imagen para el email',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Imagen destacada específica para el correo electrónico.',
              },
            },
            {
              name: 'relevantInfo',
              label: 'Información Relevante',
              type: 'richText',
              localized: true,
              admin: {
                description: 'Bloque de información destacada para el newsletter.',
              },
            },
            {
              name: 'ctaSection',
              label: 'Sección CTA',
              type: 'richText',
              localized: true,
              admin: {
                description: 'Sección de llamado a la acción para el newsletter.',
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
    {
      name: 'newsletterSent',
      label: 'Newsletter Enviado',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Indica si este post ya ha sido enviado como newsletter a través de Resend.',
      },
    },
  ],
}
