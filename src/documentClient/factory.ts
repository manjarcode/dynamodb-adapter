import AWS from 'aws-sdk'
import { AwsConfig } from '../types';
import process from 'process'


export default class DocumentClientFactory {
  static create(config?: AwsConfig) : AWS.DynamoDB.DocumentClient
  {
    AWS.config.update({
      accessKeyId: config?.accessKeyId ?? process.env.DB_ACCESS_KEY_ID,
      secretAccessKey: config?.secretAccessKey ?? process.env.DB_SECRET_ACCESS_KEY,
      region: config?.region ?? process.env.REGION
    })
    
    const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: 'latest' })
    
    return documentClient
  }
}