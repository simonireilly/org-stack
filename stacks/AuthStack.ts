import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import { TableFieldType } from '@serverless-stack/resources';

export class AuthStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const auth = new sst.Auth(this, 'Cognito', {
      cognito: {
        userPool: {
          signInAliases: { email: true, phone: true },
          customAttributes: {
            parent_org_id: new cognito.StringAttribute({
              minLen: 36,
              maxLen: 36,
              mutable: true,
            }),
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        },
      },
    });

    const usersTable = new sst.Table(this, 'Table', {
      fields: {
        pk: TableFieldType.STRING,
        sk: TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: 'pk',
        sortKey: 'sk',
      },
      dynamodbTable: {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    });

    const api = new sst.Api(this, 'Api', {
      defaultFunctionProps: {
        permissions: [[usersTable.dynamodbTable, 'grantReadWriteData']],
        environment: {
          USERS_TABLE_NAME: usersTable.tableName,
          USER_POOL_ID: auth.cognitoUserPool?.userPoolId || '',
        },
      },
      routes: {
        'POST /organisation': 'src/api/organisation/create.handler',
        'POST /organisation/{organisation_id}/user':
          'src/api/organisation/user/create.handler',
        'PUT /organisation/{organisation_id}/user':
          'src/api/organisation/user/invite.handler',
      },
    });

    this.addOutputs({
      apiUrl: api.url,
    });
  }
}
