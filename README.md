# GitHub Explorer

A full-stack web app built with React and Express that lets you search and explore GitHub users and their repositories.

## What it does

- Search for any GitHub user by username
- View a user's profile, bio, and profile picture
- Browse their repositories
- View repo details including description, creation date, last commit date, and the last 5 commit messages

## How to run it

You need two terminals open at the same time.

**Terminal 1 - Backend:**
```
cd backend
npm install
node server.js
```

**Terminal 2 - Frontend:**
```
cd frontend
npm install
npm start
```

Then open your browser and go to `http://localhost:3000`

## How to run tests

**Backend tests:**
```
cd backend
npm test
```

**Frontend tests:**
```
cd frontend
npm test
```

## Built with

- React
- Express
- Axios
- Helmet
- React Router DOM
- Jest
- Supertest
