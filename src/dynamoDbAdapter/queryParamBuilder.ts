import { TableConfig, FilterExpression } from "../types"
import ExpressionBuilder from "./expressionBuilder"

export default class QueryParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly expressionBuilder: ExpressionBuilder

  constructor(tableConfig: TableConfig, expressionBuilder: ExpressionBuilder) {
    this.tableConfig = tableConfig
    this.expressionBuilder = expressionBuilder
  }

  build(partitionValue: string, sortValue?: string, filters?: Array<FilterExpression>) {
    const hasSortValue = Boolean(sortValue)
    const params = {
      TableName: this.tableConfig.tableName,
      KeyConditionExpression: this.expressionBuilder.keyConditionExpression(hasSortValue),
      ExpressionAttributeValues: this.expressionBuilder.expressionAttributeValues(partitionValue, sortValue),
    }

    const hasFilters = Array.isArray(filters) && filters.length > 0

    if (hasFilters) {
      const {filterExpression, expressionAttributeNames} = this.expressionBuilder.filterExpression(filters)
      params['FilterExpression'] = filterExpression
      params['ExpressionAttributeNames'] = expressionAttributeNames      
    }

    return params
  }
}