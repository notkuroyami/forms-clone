import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:4000/");

/**
 * Описуємо інтерфейс для документів, які генерує codegen.
 * Вони мають метод toString(), який повертає рядок запиту.
 */
interface GraphQLDocument {
  toString(): string;
}

/**
 * Описуємо структуру аргументів, які RTK Query передає в baseQuery.
 * Замість any для variables використовуємо unknown, що є безпечнішим.
 */
interface BaseQueryArgs {
  document: string | GraphQLDocument;
  variables?: unknown;
}

export const api = createApi({
  reducerPath: "api",
  // Використовуємо подвійне приведення (as unknown as ...), щоб змінити системний тип
  // на наш кастомний, який підтримує GraphQLDocument
  baseQuery: graphqlRequestBaseQuery({
    client,
    prepareHeaders: (headers) => headers,
  }) as unknown as (args: BaseQueryArgs) => Promise<{ data: unknown } | { error: unknown }>,
  endpoints: () => ({}),
});