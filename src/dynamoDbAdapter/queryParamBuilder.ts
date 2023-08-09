import { TableConfig, FilterExpression } from "../types"
import ExpressionBuilder from "./expressionBuilder"

export default class QueryParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly expressionBuilder: ExpressionBuilder

  constructor(tableConfig: TableConfig, expressionBuilder: ExpressionBuilder) {
    this.tableConfig = tableConfig
    this.expressionBuilder = expressionBuilder
  }

  build(partitionValue: string, sortValue?: string, filter?: FilterExpression) {
    const hasSortValue = Boolean(sortValue)
    const params = {
      TableName: this.tableConfig.tableName,
      KeyConditionExpression: this.expressionBuilder.keyConditionExpression(hasSortValue),
      ExpressionAttributeValues: this.expressionBuilder.expressionAttributeValues(partitionValue, sortValue),
    }

    if (filter) {
      const {filterExpression, expressionAttributeNames} = this.expressionBuilder.filterExpression(filter)
      params['FilterExpression'] = filterExpression
      params['ExpressionAttributeNames'] = expressionAttributeNames      
    }

    return params
  }
}