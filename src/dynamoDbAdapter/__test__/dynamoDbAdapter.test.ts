import {describe, expect, test, jest} from '@jest/globals'

import DynamoDbAdapter from '../dynamoDbAdapter'
import { FilterExpressionOperator, TableConfig } from '../../types'
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

  test('query with partitionvalue, sortvalue and exists filter', () => {
    const {dynamoDbAdapter, clientMock} = setup()
    const filter = { operator: FilterExpressionOperator.Exists, attribute: 'nepe' }
    dynamoDbAdapter.query('partitionvalue', 'sortvalue', filter as any)

    const expectedParams = {
      "ExpressionAttributeValues": {
        ":partitionValue": "partitionvalue", 
        ":sortValue": "sortvalue"
      }, 
      "KeyConditionExpression": "partitionkey = :partitionValue AND sortkey = :sortValue", 
      "TableName": "tablename",
      "FilterExpression": "attribute_exists(#nepe)",
      "ExpressionAttributeNames": {
        "#nepe": "nepe"
      }
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
     )
  })
})
