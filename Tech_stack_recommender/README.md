# Tech Stack Recommender

A content-based career/role recommender built with React. Enter your skills and get the top-matching tech roles, ranked using **TF-IDF weighting** and **cosine similarity** — no user history or cold-start problem required.

## How it works

1. **Ingestion** – Your entered skills are turned into a binary skill vector.
2. **TF-IDF weighting** – Each job role's required skills are weighted so rarer, more specific skills carry more importance than common ones.
3. **Cosine similarity** – Your skill vector is compared against each role's weighted vector to produce a match score.
4. **Top-N filtering** – The 5 highest-scoring roles are shown, along with which of your skills matched.

## Tech stack

- React 18
- Vite

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
tech-stack-recommender/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx     # React entry point
    └── App.jsx      # Main app: dataset, TF-IDF/cosine engine, UI
```


