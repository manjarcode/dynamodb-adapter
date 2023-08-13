# dynamodb-adapter
Adapter to use dynamoDB from AWS for node. The purpose of this package is to simplify the use of dynamoDB instead of using the AWS DynamoDB client directly. With this package you will be able to use the basic CRUD operations with an easier interface.


# example of use
You can find some examples of use below.

```javascript
import DynamoDbAdapterFactory from '../lib/index.js'

const TABLE = 'expenses'


const partitionKey = 'partitionKey'
const sortKey = 'sortKey'
const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, partitionKey, sortKey
)

const itemId = '40c6bac9-2b9e-49c9-9ea2-fafc885e6302'

const item = {
  id: itemId,
  name: 'Electricity',
  description: '2023 May Electricity Bill',
  amount: 100,
  date: '2023-05-01',
}

// CREATE
dynamoDbAdapter.add(item).then(() => {
  console.log('created successfully')
})

//QUERY
dynamoDbAdapter.query(itemId).then((results) => {
  console.log('query:', results)
})

// SCAN
dynamoDbAdapter.scan().then((results) => {
  console.log('scan', results)
})

// UPDATE
const item = {
  id: itemId,
  name: 'Electricity',
  description: '2023 May Electricity Bill',
  amount: 100,
  date: '2023-05-01',
}

dynamoDbAdapter.update(item).then(() => {
  console.log('updated successfully')
})

// DELETE
dynamoDbAdapter.delete(itemId).then(() => {
  console.log('deleted successfully')
}

```