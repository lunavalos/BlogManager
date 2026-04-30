import type { CollectionConfig } from 'payload'
import bcrypt from 'bcryptjs'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email', 'roles'],
    components: {
      // @ts-ignore
      Icon: './components/Admin/Icons#UsersIconComponent',
    }
  },
  labels: {
    singular: 'Autor / Usuario / Perfil',
    plural: 'Autores / Usuarios / Perfil',
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            await req.payload.create({
              collection: 'authors',
              data: {
                name: doc.username || doc.email,
                user: doc.id,
              },
            })
          } catch (e) {
            console.error('Error creating author for user:', e)
          }
        }
      },
    ],
  },
  access: {
    admin: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      label: 'Nombre de Usuario',
      required: true,
      saveToJWT: true,
      admin: {
        placeholder: 'ej. lunanov',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
    },
  ],
}
