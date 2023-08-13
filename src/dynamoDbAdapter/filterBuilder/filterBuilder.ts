import { FilterExpression, FilterExpressionOperator, Queryable } from '../../types.js'

export default class FilterBuilder {
  apply (params: Queryable, filters?: FilterExpression[]): Queryable {
    const hasFilters = Array.isArray(filters) && filters.length > 0

    if (!hasFilters) {
      return params
    }

    const paramWithFilters: Queryable = { ...params }
    const filterExpression = filters
      .map(this.mapFilterExpression)
      .filter(Boolean)
      .join(' AND ')

    const expressionAttributeNames = this.mapAttributeNames(filters)

    paramWithFilters.FilterExpression = filterExpression
    paramWithFilters.ExpressionAttributeNames = expressionAttributeNames

    return paramWithFilters
  }

  private mapFilterExpression (filter: FilterExpression): string {
    const { operator, attribute } = filter

    let filterExpression = ''
    if (operator === FilterExpressionOperator.Exists) {
      filterExpression = `attribute_exists(#${attribute})`
    } else if (operator === FilterExpressionOperator.NotExists) {
      filterExpression = `attribute_not_exists(#${attribute})`
    } else if (operator === FilterExpressionOperator.Equals) {
      filterExpression = `#${attribute} = :${attribute}`
    } else {
      throw new Error(`Unsupported filter operator: ${String(operator)}`)
    }

    return filterExpression
  }

  private mapAttributeNames (filters: FilterExpression[]): Object {
    const attributeNames: Object = {}
    filters.forEach(filter => {
      const { attribute } = filter

      Object.assign(attributeNames, {
        [`#${attribute}`]: attribute
      })
    })
    return attributeNames
  }
}
