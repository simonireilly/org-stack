import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { validator } from '../../entities/organisations';
import { response } from '../../utils/response';

export const handler: APIGatewayProxyHandlerV2 = async (event, _) => {
  const { body } = event;
  if (!body) return response(422, { message: 'Body is not present' });

  const data = JSON.parse(body);

  if (validator(data)) {
    return response(200, data);
  } else {
    return response(422, {
      errors: validator.errors,
      schema: validator.schema,
    });
  }
};
