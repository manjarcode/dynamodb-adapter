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
  operator: FilterExpressionOperator,  
  attribute: string,
  value?: string
}