import { getPayload } from 'payload'
import config from '../payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env' })

async function listAdmins() {
  const payload = await getPayload({ config })
  
  const { docs: admins } = await payload.find({
    collection: 'users',
    where: {
      roles: {
        contains: 'admin'
      }
    }
  })

  console.log('--- ADMIN USERS ---')
  if (admins.length === 0) {
    console.log('No admin users found.')
  } else {
    admins.forEach(admin => {
      console.log(`Username: ${admin.username} | Email: ${admin.email} | Roles: ${admin.roles}`)
    })
  }

  // To reset a password, uncomment and edit the following:
  /*
  const userId = 'ID_OF_USER'
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      password: 'newpassword123'
    }
  })
  console.log('Password updated successfully.')
  */

  process.exit(0)
}

listAdmins()
