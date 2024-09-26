import { DynamoDBDocument, QueryCommandInput, ScanCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { Entity, FilterExpression, TableConfig, UpdateParams } from '../types.js'
import { reservedKeywords } from '../utils/constants.js'
import DeleteByPartitionKey from './deleteByPartitionKey.js'
import QueryParamBuilder from './queryParamBuilder.js'
import ScanParamBuilder from './scanParamBuilder.js'

export default class DynamoDbAdapter {
  private readonly client: DynamoDBDocument
  private readonly tableConfig: TableConfig
  private readonly scanParamBuilder: ScanParamBuilder
  private readonly queryParamBuilder: QueryParamBuilder
  private readonly deleteByPartitionKeyAdapter: DeleteByPartitionKey
  private readonly hasSortKey: boolean
  private readonly partitionKey: string
  private readonly sortKey: string

  constructor (tableConfig: TableConfig,
    documentClient: DynamoDBDocument,
    scanParamBuilder: ScanParamBuilder,
    queryBuilder: QueryParamBuilder,
    deleteByPartionKey: DeleteByPartitionKey
  ) {
    this.tableConfig = tableConfig
    this.client = documentClient
    this.queryParamBuilder = queryBuilder
    this.scanParamBuilder = scanParamBuilder
    this.deleteByPartitionKeyAdapter = deleteByPartionKey

    this.hasSortKey = this.tableConfig.sortKey !== undefined && this.tableConfig.sortKey !== null && this.tableConfig.sortKey !== ''
    this.partitionKey = this.tableConfig.partitionKey

    this.sortKey = this.hasSortKey ? this.tableConfig.sortKey : ''
  }

  async add<T extends Object>(item: T): Promise<void> {
    const params = {
      Item: {
        ...item
      },
      TableName: this.tableConfig.tableName
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.put(params, function (error: Error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await promise
  }

  async scan<T>(filters?: FilterExpression[]): Promise<T[]> {
    const params = this.scanParamBuilder.build(filters)

    const promise = new Promise<T[]>((resolve: Function, reject: Function) => {
      this.client.scan(params as ScanCommandInput, (error: Error, data: any) => {
        if (error != null) {
          reject(error)
        } else {
          resolve(data.Items)
        }
      })
    })

    return await promise
  }

  async query<T>(
    partitionValue: string,
    sortValue?: string,
    filter?: FilterExpression[]
  ): Promise<T[]> {
    const params = this.queryParamBuilder.build(partitionValue, sortValue, filter)

    const result = await this.client.query(params as QueryCommandInput)

    return result.Items as T[]
  }

  async delete (partitionKey: string, sortKey?: string): Promise<void> {
    const key = {
      [this.tableConfig.partitionKey]: partitionKey
    }

    if (this.hasSortKey) {
      key[this.tableConfig.sortKey] = String(sortKey)
    }

    const params = {
      TableName: this.tableConfig.tableName,
      Key: key
    }

    await this.client.delete(params)
  }

  async deleteByPartitionKey (partitionKeyValue: string): Promise<void> {
    await this.deleteByPartitionKeyAdapter.execute(partitionKeyValue)
  }

  async update<T extends Entity>(item: T): Promise<void> {
    const keys = [this.tableConfig.partitionKey, this.tableConfig.sortKey]
    const keysContent = this.removeKeys(item, key => !keys.includes(key))
    const itemContent = this.removeKeys(item, key => keys.includes(key))

    const updateExpression = this.updateExpression(itemContent)

    const expressionAttributesNames = this.expressionAttributeNames(itemContent)

    const expressionAttributeValues = this.expressionAttributeValues(itemContent)

    const params: UpdateParams = {
      TableName: this.tableConfig.tableName,
      Key: { ...keysContent },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    const hasExpressionAttributeNames = Object.keys(expressionAttributesNames).length > 0

    if (hasExpressionAttributeNames) {
      params.ExpressionAttributeNames = expressionAttributesNames
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.update(params as UpdateCommandInput, function (error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await promise
  }

  private removeKeys<T extends Object>(
    item: T,
    removeCondition: (key: string) => boolean
  ): Object {
    const entries = Object.entries(item)

    const removedKeys = entries
      .map(([key, value]) => {
        const shouldRemove = removeCondition(key)
        return shouldRemove ? null : [key, value]
      })
      .filter(Boolean) as Array<[string, any]>

    const assambleObj = Object.fromEntries(removedKeys)

    return assambleObj
  }

  private isReservedKeyword (key: string): boolean {
    return reservedKeywords.includes(key.toUpperCase())
  }

  private updateExpression<T extends Object>(itemContent: T): string {
    const keys = Object.keys(itemContent)

    const queryWithExtraComma = keys.reduce((acc, key) => {
      const sharpedKey = this.isReservedKeyword(key) ? `#${key}` : key
      const dottedKey = `:${key}`

      return `${acc} ${sharpedKey} = ${dottedKey},`
    }, 'set')

    const query = queryWithExtraComma.slice(0, -1)
    return query
  }

  private expressionAttributeNames<T extends Object>(itemContent: T): any {
    const keys = Object.keys(itemContent)

    const reservedKeys = keys.filter(key => this.isReservedKeyword(key))

    const result = reservedKeys.reduce((obj, key) => {
      const sharpedKey = `#${key}`

      return { ...obj, [sharpedKey]: key }
    }, {})

    return result
  }

  private expressionAttributeValues<T extends Object>(itemContent: T): any {
    const entries = Object.entries(itemContent)

    const attributeValues = entries.reduce((obj, [key, value]) => {
      const dottedKey = `:${key}`

      return { ...obj, [dottedKey]: value }
    }, {})

    return attributeValues
  }
}
