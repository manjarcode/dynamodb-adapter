import { TableConfig, FilterExpression } from "../types.js"
import ExpressionBuilder from "./expressionBuilder.js"
import FilterBuilder from "./filterBuilder.js"

export default class QueryParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly expressionBuilder: ExpressionBuilder
  private readonly filterBuilder: FilterBuilder

  constructor(
    tableConfig: TableConfig, 
    expressionBuilder: ExpressionBuilder, 
    filterBuilder: FilterBuilder
  ) {
    this.tableConfig = tableConfig
    this.expressionBuilder = expressionBuilder
    this.filterBuilder = filterBuilder
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
      const {filterExpression, expressionAttributeNames} = this.filterBuilder.build(filters)
      params['FilterExpression'] = filterExpression
      params['ExpressionAttributeNames'] = expressionAttributeNames      
    }

    return params
  }
}