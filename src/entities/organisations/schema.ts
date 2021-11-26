import { JSONSchemaType } from 'ajv';
import { APIOrganisation } from './type';

export const schema: JSONSchemaType<APIOrganisation> = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  description:
    'An organisation is the authentication primitive. Users can belong to many\norganisations, but they always have one parent.',
  examples: [
    {
      id: '74aedaae-9c58-49f6-8003-e8667becf5a0',
      name: 'Pauls scooters',
    },
  ],
  properties: {
    id: {
      description: 'The organisations unique identifier',
      format: 'uuid',
      maxLength: 36,
      minLength: 36,
      type: 'string',
    },
    name: {
      description: 'The organisations name',
      minLength: 3,
      maxLength: 16,
      type: 'string',
    },
  },
  required: ['id', 'name'],
  type: 'object',
};
