import DynamoDbAdapterFactory from '../lib/index.js'
import process from "process"
import dotenv from "dotenv"

dotenv.config()

const TABLE = 'expenses'

const config = {
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  region: process.env.DB_REGION
}

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, config
)

dynamoDbAdapter.scan().then((results) => {
  console.log('scan:', results)
})

dynamoDbAdapter.query("id", "40c6bac9-2b9e-49c9-9ea2-fafc885e6302").then((results) => {
  console.log('query:', results)
})