import { FilterExpression, FilterExpressionOperator, TableConfig } from '../types.js'

const comparableOperatorList = [
  FilterExpressionOperator.Equals,
  FilterExpressionOperator.BiggerThan,
  FilterExpressionOperator.BiggerEqualThan,
  FilterExpressionOperator.LowerThan,
  FilterExpressionOperator.LowerEqualThan
]

export default class ExpressionBuilder {
  private readonly tableConfig: TableConfig

  constructor (tableConfig: TableConfig) {
    this.tableConfig = tableConfig
  }

  keyConditionExpression (hasSortValue: boolean): string {
    let result = `${this.tableConfig.partitionKey} = :partitionValue`

    const hasSortKey = Boolean(this.tableConfig.sortKey)
    if (hasSortKey && hasSortValue) {
      result = result.concat(` AND ${String(this.tableConfig.sortKey)} = :sortValue`)
    }

    return result
  }

  private isComparableOperator (filter: FilterExpression): boolean {
    return comparableOperatorList.includes(filter.operator)
  }

  expressionAttributeValues (partitionValue?: string, sortValue?: string, filters?: FilterExpression[]): Object {
    const hasPartitionValue = Boolean(partitionValue)
    const hasSortKey = Boolean(this.tableConfig.sortKey)
    const hasSortValue = hasSortKey && Boolean(sortValue)
    const hasFilters = Array.isArray(filters) && filters.length > 0

    const expressionAttributeValues: Object = { }

    if (hasPartitionValue) {
      Object.assign(expressionAttributeValues, {
        ':partitionValue': partitionValue
      })
    }

    if (hasSortValue) {
      Object.assign(expressionAttributeValues, {
        ':sortValue': sortValue
      })
    }

    if (hasFilters) {
      filters.forEach(item => {
        if (this.isComparableOperator(item)) {
          Object.assign(expressionAttributeValues, {
            [`:${item.attribute}`]: item.value
          })
        }
      })
    }

    return expressionAttributeValues
  }
}
