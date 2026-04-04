# Google Forms Clone (Monorepo)

Это упрощенный клон Google Forms, построенный на современном стеке с использованием GraphQL, React и RTK Query.

## Технологический стек

- **Frontend:** React, TypeScript, Redux Toolkit (RTK Query), React Router.
- **Backend:** Node.js, Apollo Server (GraphQL), In-memory store.
- **Tooling:** GraphQL Code Generator (для полной типизации API), concurrently.
- **Structure:** Monorepo (npm workspaces).

## Инструкция по локальному запуску

### 1. Предварительная подготовка
Убедитесь, что у вас установлена Node.js (рекомендуемая версия v18+) и менеджер пакетов npm.

### 2. Установка зависимостей
Выполните команду в корневом каталоге проекта:
```bash
npm install --legacy-peer-deps
