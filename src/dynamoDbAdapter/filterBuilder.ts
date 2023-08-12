import { FilterExpression, FilterExpressionOperator } from "../types"

export default class FilterBuilder {
  build(filters: Array<FilterExpression>) : {filterExpression: string, expressionAttributeNames: Object} {
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