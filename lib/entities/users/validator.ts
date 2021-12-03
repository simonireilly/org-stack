import Ajv from 'ajv';
import { APIUser } from './type';
import { schema } from './schema';
import { default as addFormats } from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
  addUsedSchema: true,
});
addFormats(ajv);

export const validator = ajv.compile<APIUser>(schema);
