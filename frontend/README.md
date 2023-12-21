# Getting started with the front-end

## Create a Next.js app

First, you need to create a Next.js app in this directory. In a terminal, execute:

```console
> npx create-next-app@latest --typescript
```

Since you will be running the back-end on port `3000`, you will need to change the default port for the front-end development server. Open `package.json`and change the scripts so that the server will be started on port `8000`:

```json
"scripts": {
    "dev": "next dev -p 8000",
    "build": "next build",
    "start": "next start -p 8000",
    "lint": "next lint"
  },
```

Start the development server by opening a terminal in the `frontend` folder and running:

```console
> npm run dev

```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

You can start by modifying `pages/index.tsx` and develop React components. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js and React, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs)
-   [React Documentation](https://reactjs.org/docs/getting-started.html)
