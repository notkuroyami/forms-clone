import { ApolloServer, gql } from "apollo-server";
import { nanoid } from "nanoid";

// 1. Визначаємо перелічувані типи (Enums)
enum QuestionType {
  TEXT = "TEXT",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
}

// 2. Описуємо інтерфейси для даних
interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
}

interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  value: string[];
}

interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

// 3. Типізуємо вхідні дані (Inputs) для мутацій
interface QuestionInput {
  type: QuestionType;
  title: string;
  options?: string[];
}

interface CreateFormArgs {
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

interface SubmitResponseArgs {
  formId: string;
  answers: Answer[];
}

// 4. Ініціалізуємо БД зі строгими типами
interface InMemoryDB {
  forms: Form[];
  responses: Response[];
}

const db: InMemoryDB = {
  forms: [],
  responses: [],
};

// 5. GraphQL Schema
const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Question {
    id: ID!
    type: QuestionType!
    title: String!
    options: [String!]
  }

  input QuestionInput {
    type: QuestionType!
    title: String!
    options: [String!]
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: [String!]!
  }

  input AnswerInput {
    questionId: ID!
    value: [String!]!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput!]
    ): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]): Response!
  }
`;

// 6. Типізовані резолвери
const resolvers = {
  Query: {
    forms: (): Form[] => db.forms,
    form: (_: unknown, { id }: { id: string }): Form | undefined =>
      db.forms.find((f) => f.id === id),
    responses: (_: unknown, { formId }: { formId: string }): Response[] =>
      db.responses.filter((r) => r.formId === formId),
  },
  Mutation: {
    createForm: (_: unknown, args: CreateFormArgs): Form => {
      const newForm: Form = {
        id: nanoid(),
        title: args.title,
        description: args.description,
        questions: (args.questions || []).map((q) => ({
          ...q,
          id: nanoid(),
        })),
      };
      db.forms.push(newForm);
      return newForm;
    },
    submitResponse: (
      _: unknown,
      { formId, answers }: SubmitResponseArgs,
    ): Response => {
      const newResponse: Response = {
        id: nanoid(),
        formId,
        answers,
      };
      db.responses.push(newResponse);
      return newResponse;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀 Server ready at ${url}`);
});
