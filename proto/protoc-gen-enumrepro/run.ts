#!/usr/bin/env -S npx tsx

import { createEcmaScriptPlugin, runNodeJs, Schema } from '@bufbuild/protoplugin';
import { findCustomEnumOption } from '@bufbuild/protoplugin/ecmascript';

export function generateTs(schema: Schema) {
  for (const file of schema.files) {
    const f = schema.generateFile(`${file.name}_descriptor.ts`);
    f.preamble(file);
    for (const message of file.messages) {
      f.print("export const ", message.name, " = {");
      f.print("  name: ", message.name, ",");
      for (const field of message.fields) {
        const fieldBehavior = findCustomEnumOption(field, 1052);
        if (fieldBehavior) {
          f.print("  fieldBehavior: ", fieldBehavior, ",");
        }
      }
      f.print('};');
    }
  }
}

export function createPlugin(version = '0.0.1') {
  return createEcmaScriptPlugin({
    name: 'protoc-gen-enumrepro',
    version: `v${version}`,
    generateTs,
  });
}
  

runNodeJs(createPlugin());
