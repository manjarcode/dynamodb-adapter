import { FilterExpression, FilterExpressionOperator, QueryParams } from "../types"

export default class FilterBuilder {
  apply(params: QueryParams, filters?: Array<FilterExpression>) : QueryParams {

    const hasFilters = Array.isArray(filters) && filters.length > 0

    if (!hasFilters) {
      return params
    }

    const paramWithFilters = {...params}
    const filterExpression = filters
      .map(this.mapFilterExpression)
      .filter(Boolean)
      .join(' AND ')

    const expressionAttributeNames = this.mapAttributeNames(filters)
    
    paramWithFilters['FilterExpression'] = filterExpression
    paramWithFilters['ExpressionAttributeNames'] = expressionAttributeNames

    return paramWithFilters
  }

  private mapFilterExpression(filter: FilterExpression) : string {
    const {operator, attribute} = filter

    let filterExpression = ''
    if (operator === FilterExpressionOperator.Exists) {
      filterExpression = `attribute_exists(#${attribute})`
    } else if (operator === FilterExpressionOperator.NotExists) {
      filterExpression = `attribute_not_exists(#${attribute})`
    } else {
      throw new Error(`Unsupported filter operator: ${operator}`)
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