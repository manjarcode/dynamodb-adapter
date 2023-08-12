export interface Entity {
  id: string
}

export interface AwsConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
}

export interface TableConfig {
  tableName: string
  partitionKey: string
  sortKey?: string
}

export enum FilterExpressionOperator {
  Exists = 'Exists',
  NotExists = 'NotExists',
}

export interface FilterExpression {
  operator: FilterExpressionOperator
  attribute: string
  value?: string
}

export interface Queryable {
  TableName: string
  FilterExpression?: string
  ExpressionAttributeNames?: Object
}

export interface QueryParams extends Queryable {
  KeyConditionExpression: string
  ExpressionAttributeValues: Object
}

export interface ScanParams extends Queryable { }

export interface UpdateParams {
  TableName: string
  Key: Object
  UpdateExpression: string
  ExpressionAttributeValues: Object
  ExpressionAttributeNames?: Object
}
