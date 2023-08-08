export interface Entity {
  id: string
}

export interface AwsConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
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