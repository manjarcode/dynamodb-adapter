import DynamoDbAdapterFactory from '../lib/index.js'
import process from "process"
import dotenv from "dotenv"

dotenv.config()

const TABLE = 'tbt-expenses'

const config = {
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  region: process.env.DB_REGION
}

const partitionKey = 'reportId'

const sortKey = 'date'

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, partitionKey, sortKey, config
)

dynamoDbAdapter.scan().then((results) => {
  console.log('scan:', results)
})

const filterExpression = {
  attribute: 'category',
  operator: 'Exists'
}
dynamoDbAdapter.query('21c9f232-52d2-4594-8884-5f96473583f4', null, filterExpression).then((results) => {
  console.log('query:', results)
})

const item = {
  reportId: '21c9f232-52d2-4594-8884-5f96473583f4',
  date: 1682978400000,
  amount: -16.6,
  description: 'Pago en GROUCHOS MADRID ES',
  category: 'Alimentación',
}

dynamoDbAdapter.update(item)
