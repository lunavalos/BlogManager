import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storageAdapter = process.env.S3_BUCKET 
  ? s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    })
  : null

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        './components/Admin/AccountDropdown#default',
        './components/Admin/CustomSidebarCSS#default',
      ],
      beforeNavLinks: [
        './components/Admin/CustomNav#default',
      ],
      beforeDashboard: [
        './components/Admin/DashboardSummary#default',
      ],
    },
  },
  collections: [Users, Media, Authors, Categories, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    ...(storageAdapter ? [storageAdapter] : []),
  ],
  cors: [
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://lunavalos.com',
    'http://localhost:3000',
  ].filter(Boolean) as string[],
  csrf: [
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://lunavalos.com',
    'http://localhost:3000',
  ].filter(Boolean) as string[],
})
