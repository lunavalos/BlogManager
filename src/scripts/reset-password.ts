import { getPayload } from 'payload'
import config from '../payload.config'

async function resetPassword() {
  const payload = await getPayload({ config })
  
  const { docs: users } = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: 'Adrian'
      }
    }
  })

  if (users.length === 0) {
    console.log('User Adrian not found.')
    process.exit(1)
  }

  const userId = users[0].id
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      password: 'admin123'
    }
  })

  console.log('Password for Adrian reset to: admin123')
  process.exit(0)
}

resetPassword()
