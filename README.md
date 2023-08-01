# dynamodb-adapter
Adapter to use dynamoDB in node


# example of use

```javascript
import DynamoDbAdapterFactory from '../lib/index.js'

const TABLE = 'expenses'

const config = {
  accessKeyId: 'YOUR ACCESS KEY ID GOES HERE',
  secretAccessKey: 'YOUR SECRET ACCESS KEY GOES HERE',  
  region: 'YOUR REGION GOES HERE',
}

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, config
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
dynamoDbAdapter.query('id', itemId).then((results) => {
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