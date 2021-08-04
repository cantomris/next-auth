import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { verifyPassword } from '../../../helpers/auth'
import connectToDatabase from '../../../helpers/db'

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({     
      async authorize(credentials) {
        const client = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        const user = await usersCollection.findOne({ email: credentials.email })

        if (!user) {
          // by default it will redirect the client to another page
          client.close()
          throw new Error('No user found!')
        }

        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          client.close()
          throw new Error('Could not log you in!')
        }
        client.close()
        
        // if we return an object inside of this 'authorize' function NextAuth will know that the authorization is succeeded
        return {
          // this object later to be encoded into JWT
          email: user.email
        }
      }
    })
  ]
})