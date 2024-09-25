/* eslint-disable @typescript-eslint/no-extraneous-class */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export default class DocumentClientFactory {
  static client (): DynamoDBClient {
    return new DynamoDBClient({
      apiVersion: 'latest'
    })
  }

  static create (): DynamoDBDocument {
    const client = DocumentClientFactory.client()
    const documentClient = DynamoDBDocument.from(client)

    return documentClient
  }

  static createDocumentClient (): DynamoDBDocumentClient {
    const client = DocumentClientFactory.client()
    const documentClient = DynamoDBDocumentClient.from(client)

    return documentClient
  }
}
