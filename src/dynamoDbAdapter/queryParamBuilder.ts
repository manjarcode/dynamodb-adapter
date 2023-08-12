import { FilterExpression, QueryParams, TableConfig } from '../types.js'
import ExpressionBuilder from './expressionBuilder.js'
import FilterBuilder from './filterBuilder.js'

export default class QueryParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly expressionBuilder: ExpressionBuilder
  private readonly filterBuilder: FilterBuilder

  constructor (
    tableConfig: TableConfig,
    expressionBuilder: ExpressionBuilder,
    filterBuilder: FilterBuilder
  ) {
    this.tableConfig = tableConfig
    this.expressionBuilder = expressionBuilder
    this.filterBuilder = filterBuilder
  }

  build (partitionValue: string, sortValue?: string, filters?: FilterExpression[]): QueryParams {
    const hasSortValue = Boolean(sortValue)
    const params = {
      TableName: this.tableConfig.tableName,
      KeyConditionExpression: this.expressionBuilder.keyConditionExpression(hasSortValue),
      ExpressionAttributeValues: this.expressionBuilder.expressionAttributeValues(partitionValue, sortValue)
    }

    const paramWithFilters = this.filterBuilder.apply(params, filters)

    return paramWithFilters
  }
}
