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

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, config
)

dynamoDbAdapter.scan().then((results) => {
  console.log('scan:', results)
})

dynamoDbAdapter.query("id", "40c6bac9-2b9e-49c9-9ea2-fafc885e6302").then((results) => {
  console.log('query:', results)
})

const item = {
  reportId: "5ceacdbf-dc70-4ff8-939f-a0331debaf71",
  line: 0,
  amount:-16.6,
  description: "Pago en GROUCHOS MADRID ES",
  category: "Alimentación",
  subcategory: "Supermercados",
  read: true
}
dynamoDbAdapter.update(item, "reportId", "line")
