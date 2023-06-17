import { reservedKeywords } from '../utils/constants.js'
import {Entity} from '../types.js'

export default class DynamoDbAdapter {
  private readonly tableName: string
  private readonly client: AWS.DynamoDB.DocumentClient

  constructor (tableName: string, documentClient: AWS.DynamoDB.DocumentClient ) {
    this.client = documentClient
    this.tableName = tableName
  }

  async add (item: any): Promise<void> {
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

  async list<T>(): Promise<T[]> {
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
    const { id } = item

    const updateExpression = this.updateExpression(item)
    const expressionAttributesNames = this.expressionAttributeNames(item)
    const expressionAttributeValues = this.expressionAttributeValues(item)

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributesNames,
      ExpressionAttributeValues: expressionAttributeValues
    }

    const promise = new Promise<void>((resolve: Function, reject: Function) => {
      this.client.update(params, function (error) {
        error === null ? resolve() : reject(error)
      })
    })

    return await promise
  }

  private isReservedKeyword (key: string): boolean {
    return reservedKeywords.includes(key.toUpperCase())
  }

  private updateExpression<T extends Entity>(item: T): string {
    const { id, ...props } = item

    const keys = Object.keys(props)

    const queryWithExtraComma = keys.reduce((acc, key) => {
      const sharpedKey = this.isReservedKeyword(key) ? `#${key}` : key
      const dottedKey = `:${key}`

      return `${acc} ${sharpedKey} = ${dottedKey},`
    }, 'set')

    const query = queryWithExtraComma.slice(0, -1)
    return query
  }

  private expressionAttributeNames<T extends Entity>(item: T): any {
    const { id, ...props } = item

    const keys = Object.keys(props)

    const reservedKeys = keys.filter(key => this.isReservedKeyword(key))

    const result = reservedKeys.reduce((obj, key) => {
      const sharpedKey = `#${key}`

      return { ...obj, [sharpedKey]: key }
    }, {})

    return result
  }

  private expressionAttributeValues<T extends Entity>(item: T): any {
    const { id, ...props } = item

    const entries = Object.entries(props)

    const attributeValues = entries.reduce((obj, [key, value]) => {
      const dottedKey = `:${key}`

      return { ...obj, [dottedKey]: value }
    }, {})

    return attributeValues
  }
}
