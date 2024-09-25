import { describe, expect, jest, test } from '@jest/globals'

import { FilterExpression, FilterExpressionOperator, TableConfig } from '../../types.js'
import DynamoDbAdapter from '../dynamoDbAdapter.js'
import { DeleteByPartitionKeyFactory, QueryParamBuilderFactory, ScanParamBuilderFactory } from '../factory.js'

interface ClientMock {
  scan: jest.Mock
  query: jest.Mock
}

describe('DynamoDbAdapter', () => {
  function setup (): { dynamoDbAdapter: DynamoDbAdapter, clientMock: ClientMock} {
    const clientMock: ClientMock = {
      scan: jest.fn(),
      query: jest.fn()
    }

    const tableConfig: TableConfig = {
      tableName: 'tablename',
      partitionKey: 'partitionkey',
      sortKey: 'sortkey'
    }

    const scanParamBuilder = ScanParamBuilderFactory.create(tableConfig)
    const queryBuilder = QueryParamBuilderFactory.create(tableConfig)
    const deleteByPartionKey = DeleteByPartitionKeyFactory.create(tableConfig)
    const dynamoDbAdapter = new DynamoDbAdapter(tableConfig, clientMock as any, scanParamBuilder, queryBuilder, deleteByPartionKey)

    return { dynamoDbAdapter, clientMock }
  }

  test('scan', () => {
    const { dynamoDbAdapter, clientMock } = setup()
    void dynamoDbAdapter.scan()
    const expectedParams = {
      TableName: 'tablename'
    }

    expect(clientMock.scan).toBeCalledWith(expectedParams, expect.anything())
  })

  test('scan with filters', () => {
    const { dynamoDbAdapter, clientMock } = setup()

    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.Exists, attribute: 'having_attribute' },
      { operator: FilterExpressionOperator.NotExists, attribute: 'missing_attribute' }
    ]

    void dynamoDbAdapter.scan(filters)
    const expectedParams = {
      TableName: 'tablename',
      FilterExpression: 'attribute_exists(#having_attribute) AND attribute_not_exists(#missing_attribute)',
      ExpressionAttributeNames: {
        '#having_attribute': 'having_attribute',
        '#missing_attribute': 'missing_attribute'
      }
    }

    expect(clientMock.scan).toBeCalledWith(expectedParams, expect.anything())
  })

  test('query with partitionvalue', () => {
    const { dynamoDbAdapter, clientMock } = setup()
    void dynamoDbAdapter.query('partitionvalue')

    const expectedParams = {
      ExpressionAttributeValues: {
        ':partitionValue': 'partitionvalue'
      },
      KeyConditionExpression: 'partitionkey = :partitionValue',
      TableName: 'tablename'
    }

    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
    )
  })

  test('query with partitionvalue and sortvalue', async () => {
    const { dynamoDbAdapter, clientMock } = setup()
    void dynamoDbAdapter.query('partitionvalue', 'sortvalue')

    const expectedParams = {
      ExpressionAttributeValues: {
        ':partitionValue': 'partitionvalue',
        ':sortValue': 'sortvalue'
      },
      KeyConditionExpression: 'partitionkey = :partitionValue AND sortkey = :sortValue',
      TableName: 'tablename'
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
    )
  })

  test('query with partitionvalue, sortvalue and filters', async () => {
    const { dynamoDbAdapter, clientMock } = setup()
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.Exists, attribute: 'having_attribute' },
      { operator: FilterExpressionOperator.NotExists, attribute: 'missing_attribute' }
    ]

    void dynamoDbAdapter.query('partitionvalue', 'sortvalue', filters)

    const expectedParams = {
      ExpressionAttributeValues: {
        ':partitionValue': 'partitionvalue',
        ':sortValue': 'sortvalue'
      },
      KeyConditionExpression: 'partitionkey = :partitionValue AND sortkey = :sortValue',
      TableName: 'tablename',
      FilterExpression: 'attribute_exists(#having_attribute) AND attribute_not_exists(#missing_attribute)',
      ExpressionAttributeNames: {
        '#having_attribute': 'having_attribute',
        '#missing_attribute': 'missing_attribute'
      }
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
    )
  })

  test('query with equal filters', async () => {
    const { dynamoDbAdapter, clientMock } = setup()
    const filters: FilterExpression[] = [
      { operator: FilterExpressionOperator.Equals, attribute: 'attribute', value: 'value' }
    ]

    void dynamoDbAdapter.query('partitionvalue', undefined, filters)

    const expectedParams = {
      ExpressionAttributeValues: {
        ':partitionValue': 'partitionvalue',
        ':attribute': 'value'
      },
      KeyConditionExpression: 'partitionkey = :partitionValue',
      TableName: 'tablename',
      FilterExpression: '#attribute = :attribute',
      ExpressionAttributeNames: {
        '#attribute': 'attribute'
      }
    }
    expect(clientMock.query).toBeCalledWith(
      expectedParams,
      expect.anything()
    )
  })
})
