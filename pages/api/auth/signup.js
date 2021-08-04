import { hashPassword } from "../../../helpers/auth"
import connectToDatabase from "../../../helpers/db"

async function handler(req, res) {
  if (req.method !== 'POST') { return }

  const data = req.body
  const { email, password } = data

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(422).json({ message: 'Invalid input - password should be at least 7 characters.' })
    return 
  }

  const client = await connectToDatabase()
  const db = client.db()

  // check if user exists
  const existingUser = await db.collection('users').findOne({email: email})
  if (existingUser) {
    res.status(422).json({message: 'User already exists!'})
    // close database connection
    client.close()
    return
  }

  // hashing password
  const hashedPassword = await hashPassword(password)

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword
  })

  res.status(201).json({ message: 'Created user!' })
  // close database connection
  client.close()
  // console.log('====================================');
  // console.log(result);
  // console.log('====================================');
  
}

export default handler