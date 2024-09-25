
import { BatchWriteCommand, DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import { FilterExpression, Item, Request, TableConfig } from '../types.js'
import QueryParamBuilder from './queryParamBuilder.js' // Asegúrate de que la ruta sea correcta

export default class DeleteByPartitionKey {
  private readonly client: DynamoDBDocumentClient
  private readonly tableConfig: TableConfig
  private readonly queryParamBuilder: QueryParamBuilder

  constructor (client: DynamoDBDocumentClient, tableConfig: TableConfig, queryParamBuilder: QueryParamBuilder) {
    this.client = client
    this.tableConfig = tableConfig
    this.queryParamBuilder = queryParamBuilder
  }

  async execute (partitionKeyValue: string, sortKeyValue?: string, filters?: FilterExpression[]): Promise<void> {
    if (this.tableConfig.sortKey === null || this.tableConfig.sortKey === undefined) {
      throw new Error("Can't delete items by partition key if the table doesn't have a sort key")
    }

    const params = this.queryParamBuilder.build(partitionKeyValue, sortKeyValue, filters)
    const queryCommand = new QueryCommand(params as QueryCommandInput)
    const queryResult = await this.client.send(queryCommand)
    const items = queryResult.Items as Item[]

    if (items == null || items.length === 0) {
      return
    }

    const deleteRequests = this.buildDeleteRequests(items)

    const batches = this.buildDeleteBatches(deleteRequests)

    for (const batch of batches) {
      await this.deleteBatch(batch)
    }
  }

  private buildDeleteRequests (items: Item[]): Request[] {
    const partitionKey = this.tableConfig.partitionKey
    const sortKey = String(this.tableConfig.sortKey)

    return items.map(item => ({
      DeleteRequest: {
        Key: {
          [partitionKey]: item[partitionKey],
          [sortKey]: item[sortKey]
        }
      }
    }))
  }

  private buildDeleteBatches (deleteRequests: Request[]): Request[][] {
    const batches = []
    while (deleteRequests.length > 0) {
      batches.push(deleteRequests.splice(0, 25))
    }

    return batches
  }

  private async deleteBatch (deleteRequests: Request[]): Promise<void> {
    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: {
        [this.tableConfig.tableName]: deleteRequests
      }
    })

    await this.client.send(batchWriteCommand)
  }
}
