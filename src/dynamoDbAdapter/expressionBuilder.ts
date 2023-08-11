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

  filterExpression(filters: Array<FilterExpression>) : {filterExpression: string, expressionAttributeNames: Object} {
    const filterExpression = filters
      .map(this.mapFilterExpression)
      .filter(Boolean)
      .join(' AND ')

    const expressionAttributeNames = this.mapAttributeNames(filters)

    return {filterExpression, expressionAttributeNames}
  }

  private mapFilterExpression(filter: FilterExpression) : string {
    const {operator, attribute} = filter
    let filterExpression = ''
    if (operator === FilterExpressionOperator.Exists) {
      filterExpression = `attribute_exists(#${attribute})`
    } else if (operator === FilterExpressionOperator.NotExists) {
      filterExpression = `attribute_not_exists(#${attribute})`
    }

    return filterExpression
  }

  private mapAttributeNames(filters: Array<FilterExpression>) : Object {
    const attributeNames = {}
    filters.map(filter => {
      const { attribute } = filter
      attributeNames[`#${attribute}`] = attribute
    })
    return attributeNames
  }
}