/* eslint-disable @typescript-eslint/no-extraneous-class */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

export default class DocumentClientFactory {
  static create (): DynamoDBDocument {
    const dynamoDb = new DynamoDBClient({
      apiVersion: 'latest'
    })
    const documentClient = DynamoDBDocument.from(dynamoDb)

    return documentClient
  }
}
