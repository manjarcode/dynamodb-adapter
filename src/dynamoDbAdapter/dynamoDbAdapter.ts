import { reservedKeywords } from '../utils/constants.js'
import {Entity} from '../types.js'

export default class DynamoDbAdapter {
  private readonly tableName: string
  private readonly client: AWS.DynamoDB.DocumentClient
  private readonly partitionKey: string
  private readonly sortKey: string
  private readonly keys: Array<string>
  private readonly hasSortKey: boolean

  constructor (tableName: string,
    partitionKey: string, 
    sortKey: string = '',
    documentClient: AWS.DynamoDB.DocumentClient
  ) {
    this.client = documentClient
    this.tableName = tableName
    this.partitionKey = partitionKey
    this.sortKey = sortKey
    this.keys = [partitionKey, sortKey]
    this.hasSortKey = this.sortKey !== ''
  }

  async add<T extends Object>(item: T): Promise<void> {
    const params = {
      Item: {
        ...item
      },
      TableName: this.tableName
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.put(params, function (error: Error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await promise
  }

  async scan<T>(): Promise<T[]> {
    const params = {
      TableName: this.tableName
    }

    const promise = new Promise<T[]>((resolve: Function, reject: Function) => {
      this.client.scan(params, function (error, data: any) {

        if (error !== null) {
          reject(error)
        }

        resolve(data.Items)
      })
    })

    return await promise
  }

  async query<T>(partitionValue: string, sortValue?: string): Promise<T[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: this.queryKeyConditionExpression(sortValue),
      ExpressionAttributeValues: this.queryExpressionAttributeValues(partitionValue, sortValue)
    }

    const promise = new Promise<T[]>((resolve: Function, reject: Function) => {
      this.client.query(params, function (error: Error, data: any) {
        if (error !== null) {
          reject(error)
        }

        resolve(data?.Items)
      })
    })
    
    return await promise
  }

  private queryKeyConditionExpression(sortValue?: string): string {
    const hasSortValue = this.hasSortKey && sortValue !== undefined
    let result = `${this.partitionKey} = :partitionValue`
    
    if (hasSortValue) {
      result = result.concat(` AND ${this.sortKey} = :sortValue`)
    }

    return result
  }

  private queryExpressionAttributeValues(partitionValue: string, sortValue?: string) : Object {
    const hasSortValue = this.hasSortKey && sortValue !== undefined
    const expressionAttributeValues = {
      ':partitionValue': partitionValue
    }
    if (hasSortValue) {
      expressionAttributeValues[':sortValue'] = sortValue
    }

    return expressionAttributeValues
  }

  async delete (id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.delete(params, function (error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await promise
  }

  async update<T extends Entity>(item: T): Promise<void> {
    const keysContent = this.removeKeys(item, key => !this.keys.includes(key))
    const itemContent = this.removeKeys(item, key => this.keys.includes(key))

    const updateExpression = this.updateExpression(itemContent)

    const expressionAttributesNames = this.expressionAttributeNames(itemContent)

    const expressionAttributeValues = this.expressionAttributeValues(itemContent)

    const params = {
      TableName: this.tableName,
      Key: { ...keysContent },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    const hasExpressionAttributeNames = Object.keys(expressionAttributesNames).length > 0

    if (hasExpressionAttributeNames) {
      params['ExpressionAttributeNames'] = expressionAttributesNames
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.update(params, function (error) {
        error === null ? resolve() : reject(error)
      })
    })

    return promise
  }

  private removeKeys<T extends object>(item: T, removeCondition) {   
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
