/* eslint-disable no-console */
import process from 'process'

import dotenv from 'dotenv'

import DynamoDbAdapterFactory from '../lib/index.js'
import {FilterExpressionOperator} from '../lib/types.js'

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
  TABLE,
  partitionKey,
  sortKey,
  config
)
const filters = [
  {
    attribute: 'amount',
    operator: FilterExpressionOperator.LowerEqualThan,
    value: -21.8
  }
]
dynamoDbAdapter.scan(filters).then(results => {
  console.log('scan:', results)
})

dynamoDbAdapter
  .query('21c9f232-52d2-4594-8884-5f96473583f4', null, filters)
  .then(results => {
    console.log('query:', results)
  })

const item = {
  reportId: '21c9f232-52d2-4594-8884-5f96473583f4',
  date: 1682978400000,
  amount: -16.6,
  description: 'Pago en GROUCHOS MADRID ES',
  category: 'Alimentación'
}

dynamoDbAdapter.update(item)
