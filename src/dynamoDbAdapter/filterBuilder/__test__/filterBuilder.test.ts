import { describe, expect, test } from '@jest/globals'

import { FilterExpression, FilterExpressionOperator, Queryable } from '../../../types.js'
import FilterBuilder from '../filterBuilder.js'

describe('FilterBuilder', () => {
  const filterBuilder = new FilterBuilder()
  const emptyParams: Queryable = {
    TableName: 'tablename'
  }
  test('apply Exists operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.Exists, attribute: 'having_attribute' }
    ]
    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: 'attribute_exists(#having_attribute)',
      ExpressionAttributeNames: {
        '#having_attribute': 'having_attribute'
      }
    }
    const result = filterBuilder.apply(emptyParams, filters)

    expect(result).toEqual(expectedResult)
  })

  test('apply NotExists operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.NotExists, attribute: 'missing_attribute' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: 'attribute_not_exists(#missing_attribute)',
      ExpressionAttributeNames: {
        '#missing_attribute': 'missing_attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply Equals operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.Equals, attribute: 'attribute', value: 'value' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: '#attribute = :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply LowerThan operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.LowerThan, attribute: 'attribute', value: 'value' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: '#attribute < :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply LowerEqualThan operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.LowerEqualThan, attribute: 'attribute', value: 'value' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: '#attribute <= :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply BiggerThan operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.BiggerThan, attribute: 'attribute', value: 'value' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: '#attribute > :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply BiggerEqualThan operator', () => {
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.BiggerEqualThan, attribute: 'attribute', value: 'value' }
    ]

    const result = filterBuilder.apply(emptyParams, filters)

    const expectedResult = {
      TableName: 'tablename',
      FilterExpression: '#attribute >= :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(result).toEqual(expectedResult)
  })

  test('apply with unknown operator', () => {
    const filters: FilterExpression[] = [
      { operator: 'unknown' as FilterExpressionOperator, attribute: 'unknown_attribute' }
    ]

    const action = (): Queryable => filterBuilder.apply(emptyParams, filters)

    expect(action).toThrowError('Unsupported filter operator: unknown')
  })
})
