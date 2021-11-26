import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';

/**
 * 1) Get documented API type './type.ts'
 * 2) Produce schema from type './schema.ts'
 *
 * The generated schema should wrap inside AJV JSONSchemaType
 */

const basePath = resolve('./src/entities');

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  tsNodeRegister: true,
  out: '.schema',
};

const program = TJS.getProgramFromFiles([resolve('my-file.ts')], basePath);

const schema = TJS.generateSchema(program, 'MyType', settings);
