/* eslint-disable no-console */
import dotenv from 'dotenv'

import DynamoDbAdapterFactory from '../lib/index.js'
import {FilterExpressionOperator} from '../lib/types.js'

dotenv.config()

const TABLE = 'tbt-expenses'

const partitionKey = 'reportId'

const sortKey = 'date'

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE,
  partitionKey,
  sortKey
)

dynamoDbAdapter.add({
  reportId: '21c9f232-52d2-4594-8884-5f96473583f4',
  date: 1682978400000,
  amount: -16.6,
  description: 'Pago en GROUCHOS MADRID ES',
  category: 'Tremendo'
})

const filters = [
  {
    attribute: 'category',
    operator: FilterExpressionOperator.Equals,
    value: 'Tremendo'
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

dynamoDbAdapter.delete('21c9f232-52d2-4594-8884-5f96473583f4', 1682978400000)

dynamoDbAdapter.deleteByPartitionKey('21c9f232-52d2-4594-8884-5f96473583f4')
