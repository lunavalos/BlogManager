import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { isAdminOrEditor } from '../access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// In production (Docker) the working dir is /app — use the mounted volume path.
// Locally, use a ./media folder relative to the project root.
const mediaDir = process.env.MEDIA_DIR || path.resolve(dirname, '../../media')

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
  upload: {
    staticDir: mediaDir,
  },
}
