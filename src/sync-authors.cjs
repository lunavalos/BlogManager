const payload = require('payload')
const path = require('path')

const syncAuthors = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'temp-secret',
    local: true,
  })

  const users = await payload.find({
    collection: 'users',
    limit: 100,
  })

  console.log(`Found ${users.totalDocs} users. Checking authors...`)

  for (const user of users.docs) {
    const existingAuthor = await payload.find({
      collection: 'authors',
      where: {
        user: {
          equals: user.id,
        },
      },
    })

    if (existingAuthor.totalDocs === 0) {
      console.log(`Creating author for user: ${user.username || user.email}`)
      await payload.create({
        collection: 'authors',
        data: {
          name: user.username || user.email,
          user: user.id,
        },
      })
    }
  }

  process.exit(0)
}

syncAuthors()
