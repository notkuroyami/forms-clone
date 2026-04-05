# Google Forms Lite Clone (Monorepo)

Це спрощений клон Google Forms, побудований на сучасному стеку з використанням GraphQL, React та RTK Query.

## Технологічний стек

- **Frontend:** React, TypeScript, Redux Toolkit (RTK Query), React Router.
- **Backend:** Node.js, Apollo Server (GraphQL), In-memory store.
- **Tooling:** GraphQL Code Generator (для повної типізації API), concurrently.
- **Structure:** Monorepo (npm workspaces).

## Інструкція з локального запуску

### 1. Попередня підготовка
Переконайтеся, що у вас встановлено Node.js (рекомендована версія v18+) та менеджер пакетів npm.

### 2. Встановлення залежностей
Виконайте команду в кореневому каталозі проєкту:
```bash
npm install --legacy-peer-deps
