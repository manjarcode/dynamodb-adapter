import DocumentClientFactory from "../documentClient/factory"
import { AwsConfig, TableConfig } from "../types"
import DynamoDbAdapter from "./dynamoDbAdapter"
import ExpressionBuilder from "./expressionBuilder"
import QueryParamBuilder from "./queryParamBuilder"

export default class DynamoDbAdapterFactory {
  static create(
    tableName: string,
    partitionKey: string,
    sortKey: string,
    config?: AwsConfig
  ) : DynamoDbAdapter {

    const tableConfig = {tableName, partitionKey, sortKey} as TableConfig

    const dynamoDbAdapter =  new DynamoDbAdapter(
      tableConfig,
      DocumentClientFactory.create(config),
      QueryParamBuilderFactory.create(tableConfig)
    )

    return dynamoDbAdapter
  }
}

export class ExpressionBuilderFactory {
  static create(
    tableConfig: TableConfig
  ) : ExpressionBuilder {
    return new ExpressionBuilder(tableConfig)
  }
}

export class QueryParamBuilderFactory {
  static create(
    tableConfig: TableConfig
  ) : QueryParamBuilder {
    return new QueryParamBuilder(
      tableConfig, 
      ExpressionBuilderFactory.create(tableConfig)
    )
  }
}