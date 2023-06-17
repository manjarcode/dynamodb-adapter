# dynamodb-adapter
Adapter to use dynamoDB in node


# example of use

```javascript
import DynamoDbAdapterFactory from 'dynamodb-adapter'

const TABLE = 'expenses'

const config = {
  accessKeyId: 'AKIAXWQ7G3PXO6E5PHGO',
  secretAccessKey: 'VWNsmR3FauZVpxJYZrvQfi9rAOWNQ9uF9EWzSD7h',  
  region: 'us-east-1',
}

const dynamoDbAdapter = DynamoDbAdapterFactory.create(
  TABLE, config
)

dynamoDbAdapter.list().then((results) => {
  console.log('list', results)
})
```