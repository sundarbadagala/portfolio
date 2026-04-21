## Tech Stack

- ### API Calling
  - fetch / axios
- ### Store
  - Redux Toolkit
- ### Styling
  - Chakra UI

## Installing Story Book

To run Storybook you need to have Node.js 18 or higher

```bash
nvm install 18
```

```bash
npx sb init
```

## Installing React Testing

```bash
npm i @testing-library/jest-dom@5.17.0
npm i @testing-library/react@15.0.7
npm i @testing-library/user-event@14.5.2
```

open `src/setupTests.ts`

```bash
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

## Setup for React Absolute paths

open `tsconfig.json`

```bash
{
  "compilerOptions": {
  "baseUrl": "src",
  "paths": {
  "@/_": ["_"]
  }
  ....
  }
  ....
}
```
open `vite.config.ts`
```bash
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
```

## Concepts Implemented

- React SEO: `react-helmet-async@2.0.5`
- Dangerously set inner HTML:
- React Lazy Loading
- Story Book
- React Testing
- Redux Loggin - `redux-logger@3.0.6`
