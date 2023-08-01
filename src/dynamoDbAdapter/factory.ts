import DocumentClientFactory from "../documentClient/factory.js"
import { AwsConfig } from "../types"
import DynamoDbAdapter from "./dynamoDbAdapter.js"

export default class DynamoDbAdapterFactory {
  static create(
    tableName: string,
    partitionKey: string,
    sortKey: string,
    config?: AwsConfig
  ) : DynamoDbAdapter {
    const dynamoDbAdapter =  new DynamoDbAdapter(
      tableName,       
      partitionKey,
      sortKey,
      DocumentClientFactory.create(config)
    )

    return dynamoDbAdapter  
  }
}