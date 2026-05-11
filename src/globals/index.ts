import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: {
    hidden: true,
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    hidden: true,
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'menu',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
