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

dynamoDbAdapter.list().then((results) => {
  console.log('list', results)
})