import { FilterExpression, ScanParams, TableConfig } from '../types.js'
import FilterBuilder from './filterBuilder/filterBuilder.js'

export default class ScanParamBuilder {
  private readonly tableConfig: TableConfig
  private readonly filterBuilder: FilterBuilder

  constructor (tableConfig: TableConfig, filterBuilder: FilterBuilder) {
    this.tableConfig = tableConfig
    this.filterBuilder = filterBuilder
  }

  build (filters?: FilterExpression[]): ScanParams {
    const params = {
      TableName: this.tableConfig.tableName
    }

    const paramWithFilters: ScanParams = this.filterBuilder.apply(params, filters)

    return paramWithFilters
  }
}
