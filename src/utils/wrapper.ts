import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';

export const wrapper = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  handler: (
    event: APIGatewayProxyEventV2,
    context: Context
  ) => APIGatewayProxyStructuredResultV2
) => {
  // Init logger
  // Setup error monitoring
  // Mutate context
  const response = await handler(event, context);
};
