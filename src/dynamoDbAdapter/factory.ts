/* eslint-disable @typescript-eslint/no-extraneous-class */
import DocumentClientFactory from '../documentClient/factory.js'
import { TableConfig } from '../types.js'
import FilterBuilder from './filterBuilder/filterBuilder.js'
import DeleteByPartitionKey from './deleteByPartitionKey.js'
import DynamoDbAdapter from './dynamoDbAdapter.js'
import ExpressionBuilder from './expressionBuilder.js'
import QueryParamBuilder from './queryParamBuilder.js'
import ScanParamBuilder from './scanParamBuilder.js'

export default class DynamoDbAdapterFactory {
  static create (
    tableName: string,
    partitionKey: string,
    sortKey: string
  ): DynamoDbAdapter {
    const hasSortKey = sortKey !== undefined && sortKey !== null && sortKey !== ''
    const tableConfig: TableConfig = { tableName, partitionKey, hasSortKey, sortKey }

    const dynamoDbAdapter = new DynamoDbAdapter(
      tableConfig,
      DocumentClientFactory.create(),
      ScanParamBuilderFactory.create(tableConfig),
      QueryParamBuilderFactory.create(tableConfig),
      DeleteByPartitionKeyFactory.create(tableConfig)
    )

    return dynamoDbAdapter
  }
}

export class ExpressionBuilderFactory {
  static create (
    tableConfig: TableConfig
  ): ExpressionBuilder {
    return new ExpressionBuilder(tableConfig)
  }
}

export class FilterBuilderFactory {
  static create (): FilterBuilder {
    return new FilterBuilder()
  }
}

export class ScanParamBuilderFactory {
  static create (
    tableconfig: TableConfig
  ): ScanParamBuilder {
    return new ScanParamBuilder(
      tableconfig,
      ExpressionBuilderFactory.create(tableconfig),
      FilterBuilderFactory.create()
    )
  }
}
export class QueryParamBuilderFactory {
  static create (
    tableConfig: TableConfig
  ): QueryParamBuilder {
    return new QueryParamBuilder(
      tableConfig,
      ExpressionBuilderFactory.create(tableConfig),
      FilterBuilderFactory.create()
    )
  }
}

export class DeleteByPartitionKeyFactory {
  static create (
    tableconfig: TableConfig
  ): DeleteByPartitionKey {
    return new DeleteByPartitionKey(
      DocumentClientFactory.createDocumentClient(), tableconfig,
      QueryParamBuilderFactory.create(tableconfig)
    )
  }
}
