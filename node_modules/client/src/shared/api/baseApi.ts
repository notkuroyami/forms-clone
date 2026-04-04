import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient('http://localhost:4000/');

/**
 * Описуємо інтерфейс, який використовує Codegen, 
 * щоб RTK Query знав, як з ним працювати.
 */
interface TypedDocument {
  toString(): string;
}

export const api = createApi({
  reducerPath: 'api',
  // Ми кажемо RTK Query: "У полі document може бути рядок АБО наш TypedDocument"
  baseQuery: graphqlRequestBaseQuery({ 
    client,
    prepareHeaders: (headers) => headers, // залиш як є
  }) as any, // Тимчасово приводимо до any, щоб проковтнув кастомний формат
  endpoints: () => ({}),
});