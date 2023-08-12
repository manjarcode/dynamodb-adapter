import { TableConfig } from '../types.js'

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

  expressionAttributeValues (partitionValue: string, sortValue?: string): Object {
    const hasSortKey = Boolean(this.tableConfig.sortKey)
    const hasSortValue = hasSortKey && Boolean(sortValue)

    const expressionAttributeValues: Object = {
      ':partitionValue': partitionValue
    }

    if (hasSortValue) {
      Object.assign(expressionAttributeValues, {
        ':sortValue': sortValue
      })
    }

    return expressionAttributeValues
  }
}
