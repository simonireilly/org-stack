import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import pino from 'pino';
import { logger } from './logger';
import { response } from './response';

interface DecoratedContext extends Context {
  logger: pino.Logger;
  response: typeof response;
}

/**
 * Adds additional properties to te NodeJS lambda context object
 * @param {APIGatewayProxyEventV2} event
 * @param {Context} context
 * @returns
 */
export const contextDecorator = (
  event: APIGatewayProxyEventV2,
  context: Context
): DecoratedContext => {
  const contextLogger = logger.child({
    requestId: event.requestContext.requestId,
    route: event.routeKey,
    user: {
      claims: event.requestContext.authorizer?.jwt.claims,
      scopes: event.requestContext.authorizer?.jwt.scopes,
    },
    functionName: context.functionName,
    functionVersion: context.functionVersion,
  });

  contextLogger.info({ status: 'Initialized' }, 'Ready to log with context');

  const decoratedContext = {
    logger: contextLogger,
    response: response,
    ...context,
  };

  return decoratedContext;
};
