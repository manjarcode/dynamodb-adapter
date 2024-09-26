export interface Entity {
  id: string
}

export interface TableConfig {
  tableName: string
  partitionKey: string
  hasSortKey: boolean
  sortKey: string
}

export enum FilterExpressionOperator {
  Exists = 'Exists',
  NotExists = 'NotExists',
  Equals = 'Equals',
  LowerThan = 'LowerThan',
  LowerEqualThan = 'LowerEqualThan',
  BiggerThan = 'BiggerThan',
  BiggerEqualThan = 'BiggerEqualThan'
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
  ExpressionAttributeValues?: Object
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

export interface Item {
  [key: string]: any
}

export interface DeleteRequest {
  Key: {
    [key: string]: any
  }
}

export interface Request {
  DeleteRequest: DeleteRequest
}
