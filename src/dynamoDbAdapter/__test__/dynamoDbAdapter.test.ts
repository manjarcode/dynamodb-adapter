import {describe, expect, test, jest} from '@jest/globals'

import DynamoDbAdapter from '../dynamoDbAdapter'
import { FilterExpression, FilterExpressionOperator, TableConfig } from '../../types'
import { QueryParamBuilderFactory } from '../factory'

describe('DynamoDbAdapter', () => {
  const setup = () => {
    const clientMock = {
      query: jest.fn()
    }

    const tableConfig = {
      tableName: 'tablename',
      partitionKey: 'partitionkey',
      sortKey: 'sortkey'
    } as TableConfig
    
    const queryBuilder = QueryParamBuilderFactory.create(tableConfig)
    const dynamoDbAdapter = new DynamoDbAdapter(tableConfig, clientMock as any, queryBuilder)

    return {dynamoDbAdapter, clientMock}
  }

  test('query with partitionvalue', () => {
    const {dynamoDbAdapter, clientMock} = setup()
    dynamoDbAdapter.query('partitionvalue')

    const expectedParams = {
      "ExpressionAttributeValues": {
        ":partitionValue": "partitionvalue", 
      }, 
      "KeyConditionExpression": "partitionkey = :partitionValue", 
      "TableName": "tablename"
    }

    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
     )
  })

  test('query with partitionvalue and sortvalue', () => {   
    const {dynamoDbAdapter, clientMock} = setup()
    dynamoDbAdapter.query('partitionvalue', 'sortvalue')

    const expectedParams = {
      "ExpressionAttributeValues": {
        ":partitionValue": "partitionvalue", 
        ":sortValue": "sortvalue"
      }, 
      "KeyConditionExpression": "partitionkey = :partitionValue AND sortkey = :sortValue", 
      "TableName": "tablename"
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
     )
  })

  test('query with partitionvalue, sortvalue and exists filters', () => {
    const {dynamoDbAdapter, clientMock} = setup()
    const filters = [
      { operator: FilterExpressionOperator.Exists, attribute: 'having_attribute' },
      { operator: FilterExpressionOperator.NotExists, attribute: 'missing_attribute' },
    ] as Array<FilterExpression>

    dynamoDbAdapter.query('partitionvalue', 'sortvalue', filters as any)

    const expectedParams = {
      "ExpressionAttributeValues": {
        ":partitionValue": "partitionvalue", 
        ":sortValue": "sortvalue"
      }, 
      "KeyConditionExpression": "partitionkey = :partitionValue AND sortkey = :sortValue", 
      "TableName": "tablename",
      "FilterExpression": "attribute_exists(#having_attribute) AND attribute_not_exists(#missing_attribute)",
      "ExpressionAttributeNames": {
        "#having_attribute": "having_attribute",
        "#missing_attribute": "missing_attribute"
      }
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
     )
  })
})
