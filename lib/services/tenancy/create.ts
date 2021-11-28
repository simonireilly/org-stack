import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  DeliveryMediumType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import pino from 'pino';

const client = new CognitoIdentityProviderClient({});

/**
 * Function to create a new tenant
 *
 * 1) Assign random uuid
 * 2) Create admin user for tenant with parent_org_id attributes
 * 3) Add tenant to DynamoDB
 *
 */
export const createTenantAdminUser = async (
  email: string,
  tenantId: string,
  userPoolId: string,
  options: {
    logger: pino.Logger;
  }
) => {
  try {
    const cognitoAdminUser = await client.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
        UserAttributes: [
          { Name: 'email', Value: email },
          {
            Name: 'custom:parent_org_id',
            Value: tenantId,
          },
        ],
      })
    );

    return cognitoAdminUser;
  } catch (e) {
    const error = e as Error;

    options.logger.error(
      {
        ...error,
      },
      'Could not create admin user due to error'
    );
  }
};
