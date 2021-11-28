import pino from 'pino';
import nock from 'nock';
import { AdminCreateUserResponse } from '@aws-sdk/client-cognito-identity-provider';
import { createTenantAdminUser } from '.';

// Pipe your test logger to a file; so you can enjoy silence
// yet still debug your test logs
const testLogger = pino(pino.destination('./tests.log.json'));

describe('Create Tenant', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  test('sets the email, and tenant id of an admin tenant', async () => {
    const response: AdminCreateUserResponse['User'] = {
      Enabled: true,
    };

    nock('https://cognito-idp.eu-west-1.amazonaws.com')
      .post('/')
      .reply(201, { User: response });

    const user = await createTenantAdminUser(
      'simon@example.com',
      'mock-tenant-id',
      '11223',
      {
        logger: testLogger,
      }
    );

    expect(user?.User).toEqual<AdminCreateUserResponse['User']>({
      Enabled: true,
    });
  });
});
