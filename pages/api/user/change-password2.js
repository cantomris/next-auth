import { getSession } from "next-auth/client"
import { hashPassword, verifyPassword } from "../../../helpers/auth"
import connectToDatabase from "../../../helpers/db"

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return
  }

  const session = await getSession({req: req})

  if (!session) {
    res.status(401).json({ message: 'Not authorized!' })
    return
  }

  const userEmail = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')
  const user = await usersCollection.findOne({ email: userEmail })

  if (!user) {
    res.status(404).json({ message: 'User not found!' })
    client.close()
    return
  }

  const currentPassword = user.newPassword
  const validatePassword = await verifyPassword(oldPassword, currentPassword)

  if (!validatePassword) {
    res.status(403).json({ message: 'Permission denied!' })
    // OR res.status(422).json({ message: 'Passwords do not match!' })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(newPassword)

  const result = await usersCollection.updateOne({ email: userEmail }, { $set: { password: hashedPassword } })
  client.close()
  res.status(200).json({ message: 'Password updated!' })
}

export default handler