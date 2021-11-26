import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import { TableFieldType } from '@serverless-stack/resources';

export class AuthStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    /**
     * User Pool that allows only admins to sign up users, requires secure
     * password and MFA codes
     */
    const organisationsPool = new cognito.UserPool(
      this,
      'OrganisationsUserPool',
      {
        signInAliases: { email: true },
        autoVerify: { email: true, phone: true },
        passwordPolicy: {
          minLength: 18,
          requireLowercase: true,
          requireUppercase: true,
          requireDigits: true,
          requireSymbols: true,
          tempPasswordValidity: cdk.Duration.days(3),
        },
        selfSignUpEnabled: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        mfa: cognito.Mfa.REQUIRED,
        customAttributes: {
          parent_org_id: new cognito.StringAttribute({
            minLen: 36,
            maxLen: 36,
            mutable: false,
          }),
        },
      }
    );

    organisationsPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: `${this.stage}`,
      },
    });

    /**
     * Cognito client used to allow sign up through the hosted UI
     */
    const organisationsClient = new cognito.UserPoolClient(
      this,
      'OrganisationsClient',
      {
        userPool: organisationsPool,
        accessTokenValidity: cdk.Duration.minutes(30),
        idTokenValidity: cdk.Duration.minutes(30),
        refreshTokenValidity: cdk.Duration.days(1),
        preventUserExistenceErrors: true,
        enableTokenRevocation: true,
        oAuth: {
          flows: {
            implicitCodeGrant: true,
          },
          scopes: [cognito.OAuthScope.OPENID],
          callbackUrls: ['https://my-app-domain.com/welcome'],
          logoutUrls: ['https://my-app-domain.com/signin'],
        },
      }
    );

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
          USER_POOL_ID: organisationsPool.userPoolId,
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
