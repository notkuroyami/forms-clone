import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:4000/");

/**
 * Описуємо інтерфейс для документів GraphQL.
 * Це дозволяє RTK Query розуміти об'єкти, які генерує codegen.
 */
interface TypedDocument {
  toString(): string;
}

// Використовуємо інтерфейс у визначенні типу, щоб прибрати помилку "unused"
type CustomBaseQuery = ReturnType<typeof graphqlRequestBaseQuery> & {
  document?: TypedDocument | string;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    client,
    prepareHeaders: (headers) => headers,
  }) as CustomBaseQuery,
  endpoints: () => ({}),
});
