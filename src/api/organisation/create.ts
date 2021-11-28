import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { createTenantAdminUser } from '../../../lib/services/tenancy';
import { validator } from '../../../lib/entities/organisations';
import { contextDecorator } from '../../../lib/utils/context-decorator';
import { v4 } from 'uuid';

const userPoolId = String(process.env.USER_POOL_ID);

export const handler: APIGatewayProxyHandlerV2 = async (
  event,
  lambdaContext
) => {
  const context = contextDecorator(event, lambdaContext);

  context.logger.info(
    { route: event.routeKey },
    'Initialized lambda for event'
  );

  const { body } = event;
  if (!body) return context.response(422, { message: 'Body is not present' });

  const data = JSON.parse(body);

  if (validator(data)) {
    // Create admin user
    await createTenantAdminUser(data.adminEmail, v4(), userPoolId, {
      logger: context.logger,
    });

    return context.response(200, data);
  } else {
    return context.response(422, {
      errors: validator.errors,
      schema: validator.schema,
    });
  }
};
