import { JSONSchemaType } from 'ajv';
import { APIUser } from './type';

export const schema: JSONSchemaType<APIUser> = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  description:
    'A user is the actor primitive, that can belong to many organisations\n\nThe users Roles are controlled by cognito, along with the parent_org_id.\n\nWhen a user authenticates with an organisation, its org_id is set to that\norganisations id. The parent_org_id will always be set as well.\n\nChild orgs can remove users from their org, but only the parent org can\ndelete the user.',
  examples: [
    {
      email: 'sean@lawfirm.example.com',
      id: '74aedaae-9c58-49f6-8003-e8667becf5a0',
      name: 'Sean Price King IV',
    },
  ],
  properties: {
    email: {
      description: 'The users email',
      format: 'email',
      maxLength: 16,
      minLength: 3,
      type: 'string',
    },
    id: {
      description: 'The users unique id',
      format: 'uuid',
      maxLength: 36,
      minLength: 36,
      type: 'string',
    },
    name: {
      description: 'The users name',
      maxLength: 16,
      minLength: 3,
      type: 'string',
    },
  },
  required: ['email', 'name'],
  type: 'object',
};
