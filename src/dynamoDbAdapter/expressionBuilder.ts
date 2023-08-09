import { FilterExpression, FilterExpressionOperator, TableConfig } from "../types"

export default class ExpressionBuilder {
  private readonly tableConfig: TableConfig

  constructor(tableConfig: TableConfig) {
    this.tableConfig = tableConfig
  }

  keyConditionExpression(hasSortValue: boolean): string {
    let result = `${this.tableConfig.partitionKey} = :partitionValue`
    
    if (hasSortValue) {
      result = result.concat(` AND ${this.tableConfig.sortKey} = :sortValue`)
    }
  
    return result
  }

  expressionAttributeValues(partitionValue: string, sortValue?: string, filter?: FilterExpression) : Object {
    const hasSortKey = Boolean(this.tableConfig.sortKey)
    const hasSortValue = hasSortKey && Boolean(sortValue)
    const expressionAttributeValues = {
      ':partitionValue': partitionValue
    }
    if (hasSortValue) {
      expressionAttributeValues[':sortValue'] = sortValue
    }

    return expressionAttributeValues
  }

  filterExpression(filter: FilterExpression) : {filterExpression: string, expressionAttributeNames: Object} {
    const {operator, attribute, value} = filter

    let filterExpression = ''
    if (operator === FilterExpressionOperator.Exists) {
      filterExpression = `attribute_exists(#${attribute})`
    }

    const expressionAttributeNames = {
      [`#${attribute}`]: attribute
    }

    return {filterExpression, expressionAttributeNames}
  }
}