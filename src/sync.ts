import { getPayload } from 'payload'
import configPromise from './payload.config'

const sync = async () => {
  const payload = await getPayload({ config: configPromise })

  const users = await payload.find({
    collection: 'users',
    limit: 100,
  })

  console.log(`Syncing ${users.totalDocs} users to authors...`)

  for (const user of users.docs) {
    const existing = await payload.find({
      collection: 'authors',
      where: {
        user: { equals: user.id }
      }
    })

    if (existing.totalDocs === 0) {
      console.log(`Creating author for: ${user.username || user.email}`)
      await payload.create({
        collection: 'authors',
        data: {
          name: user.username || user.email,
          user: user.id,
        }
      })
    }
  }
  
  process.exit(0)
}

sync()
