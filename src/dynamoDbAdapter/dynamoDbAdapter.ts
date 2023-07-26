import { reservedKeywords } from '../utils/constants.js'
import {Entity} from '../types.js'

export default class DynamoDbAdapter {
  private readonly tableName: string
  private readonly client: AWS.DynamoDB.DocumentClient

  constructor (tableName: string, documentClient: AWS.DynamoDB.DocumentClient ) {
    this.client = documentClient
    this.tableName = tableName
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

  async query<T>(key: string, value: any): Promise<T[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${key} = :value`,
      ExpressionAttributeValues: {
        ':value': value
      }
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

  async update<T extends Entity>(item: T, partitionKey: string = 'id', sortKey: string): Promise<void> {
    const keys = [partitionKey, sortKey]
    const keysContent = this.removeKeys(item, keys, key => !keys.includes(key))
    const itemContent = this.removeKeys(item, keys, key => keys.includes(key))

    const updateExpression = this.updateExpression(itemContent)

    const expressionAttributesNames = this.expressionAttributeNames(itemContent)

    const expressionAttributeValues = this.expressionAttributeValues(itemContent)

    const params = {
      TableName: this.tableName,
      Key: { ...keysContent },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributesNames,
      ExpressionAttributeValues: expressionAttributeValues
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.update(params, function (error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await Promise.resolve()
  }

  private itemKeys<T extends object>(item: T): Object {
    return {}
  }

  private removeKeys<T extends object>(item: T, keys: Array<String>, removeCondition) {   
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
