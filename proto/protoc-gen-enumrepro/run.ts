#!/usr/bin/env -S npx tsx

import { createEcmaScriptPlugin, runNodeJs, Schema } from '@bufbuild/protoplugin';
import { findCustomEnumOption, findCustomMessageOption, literalString } from '@bufbuild/protoplugin/ecmascript';
import { MyCustomOption } from './gen/repro/v1/repro_pb';

export function generateTs(schema: Schema) {
  for (const file of schema.files) {
    const f = schema.generateFile(`${file.name}_descriptor.ts`);
    f.preamble(file);
    for (const message of file.messages) {
      f.print("export const ", message.name, " = {");
      f.print("  name: ", literalString(message.name), ",");
      for (const field of message.fields) {
        const fieldBehavior = findCustomEnumOption(field, 1052);
        if (fieldBehavior) {
          f.print("  fieldBehavior: ", fieldBehavior, ",");
        }
        
      }
      const myCustomOption = findCustomMessageOption(message, 999999, MyCustomOption);
      if (myCustomOption) {
        f.print("  myCustomOption: ", myCustomOption.toJsonString({ emitDefaultValues: true }), ",");
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
