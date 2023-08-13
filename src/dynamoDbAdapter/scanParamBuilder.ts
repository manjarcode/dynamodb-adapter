import { FilterExpression, ScanParams, TableConfig } from '../types.js'
import FilterBuilder from './filterBuilder/filterBuilder.js'
import ExpressionBuilder from './expressionBuilder.js'

export default class ScanParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly filterBuilder: FilterBuilder
  private readonly expressionBuilder: ExpressionBuilder

  constructor (
    tableConfig: TableConfig,
    expressionBuilder: ExpressionBuilder,
    filterBuilder: FilterBuilder
  ) {
    this.tableConfig = tableConfig
    this.expressionBuilder = expressionBuilder
    this.filterBuilder = filterBuilder
  }

  build (filters?: FilterExpression[]): ScanParams {
    const params = {
      TableName: this.tableConfig.tableName
    }
    const expressionAttributeValues = this.expressionBuilder
      .expressionAttributeValues(undefined, undefined, filters)

    const hasExpressionAttributeNames = Object.keys(expressionAttributeValues).length > 0

    if (hasExpressionAttributeNames) {
      Object.assign(params, {
        ExpressionAttributeValues: expressionAttributeValues
      })
    }

    const paramWithFilters: ScanParams = this.filterBuilder.apply(params, filters)

    return paramWithFilters
  }
}
