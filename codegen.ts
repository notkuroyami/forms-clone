import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: "packages/client/src/**/*.graphql",
  generates: {
    "packages/client/src/shared/api/generated.ts": {
      plugins: [
        {
          add: {
            content: `
export class TypedDocumentString<TResult, TVariables> {
  /** * Використовуємо параметри типів у фіктивних полях, 
   * щоб TS не сварився на "unused parameters"
   */
  __apiType?: TResult;
  __variablesType?: TVariables;

  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
`,
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-rtk-query",
      ],
      config: {
        importBaseApiFrom: "./baseApi",
        importBaseApiValue: "api",
        // ВАЖЛИВО: використовуємо 'string', щоб генератор видавав рядки всередині класу
        documentMode: "string",
        exportHooks: true,
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
