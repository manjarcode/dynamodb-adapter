# dynamodb-adapter
Adapter to use dynamoDB from AWS for node. The purpose of this package is to simplify the use of dynamoDB instead of using the AWS DynamoDB client directly. With this package you will be able to use the basic CRUD operations with an easier interface.

# Setup
In order to be able to use this package properly you will need to configure the AWS environment variables:

- AWS_ACCESS_KEY_ID: The access key for your AWS account.
- AWS_SECRET_ACCESS_KEY: The secret key for your AWS account.
- AWS_REGION: The region where your dynamoDB table is located.

You can find more information about how to configure your AWS environment variables in a Vercel project [here](https://vercel.com/guides/how-can-i-use-aws-sdk-environment-variables-on-vercel).

# Create a dynamodb-adapter instance

In order to create a dynamodb-adapter instance you will need to call the create method of the DynamoDbAdapterFactory class. This method will return a dynamodb-adapter instance. You will need to provide the following parameters:
  - TABLE: The name of the dynamoDB table.
  - partitionKey: The name of the partition key.
  - sortKey: The name of the sort key.

```javascript
const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, partitionKey, sortKey
)
```

# Query and Scan
You can use the query and scan methods to retrieve data from your dynamoDB table.

```javascript
dynamoDbAdapter.scan().then((results) => {
  console.log('scan', results)
})
```

The main difference is that using the query method you will be able to retrieve data using the partition key and the sort key.

```javascript
dynamoDbAdapter.query(itemId).then((results) => {
  console.log('query:', results)
})
```

## Filters
You can use filters to retrieve data from your dynamoDB table. You can combine the following filters:
  - Equals
  - LowerThan
  - LowerEqualThan
  - BiggerThan
  - BiggerEqualThan
  - Exists
  - NotExists
  

```javascript
const filters = [
  {
    name: 'amount',
    operator: 'LowerThan',
    value: 100,    
  },
  {
    name: 'category',    
    operator: 'Exists',
  },
]

dynamoDbAdapter.scan(filters).then((results) => {
  console.log('query:', results)
})

```

# Add 
You can use the add method to add a new item to your dynamoDB table.

```javascript
const item = {
  id: itemId,
  name: 'Electricity',
  description: '2023 May Electricity Bill',
  amount: 100,
  date: '2023-05-01',
}

dynamoDbAdapter.add(item).then(() => {
  console.log('created successfully')
})
```

# Update
You can use the update method to update an existing item in your dynamoDB table.

```javascript
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
```

You won't need to specify the partition key and the sort key in the item object because they are already specified when you create the dynamodb-adapter instance.

# Delete
You can use the delete method to delete an existing item in your dynamoDB table.

```javascript
dynamoDbAdapter.delete(itemId).then(() => {
  console.log('deleted successfully')
}
```
