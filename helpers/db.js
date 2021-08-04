import { MongoClient } from 'mongodb'

async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb+srv://cantomris:cantomris123@nextjsbackendcluster.kshwt.mongodb.net/auth-test?retryWrites=true&w=majority')

  return client
}

export default connectToDatabase