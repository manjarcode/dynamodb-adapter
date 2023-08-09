import {describe, expect, test} from '@jest/globals'

import DynamoDbAdapterFactory from '../factory'
import { TableConfig } from '../../types'

describe('DynamoDbAdapterFactory', () => {
  test('create method', () => {
    const dynamoDbAdapter = DynamoDbAdapterFactory.create('tablename','partitionkey', 'sortkey')
    expect(dynamoDbAdapter).toBeDefined()
  })
})