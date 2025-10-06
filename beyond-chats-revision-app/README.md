# Beyond Chats — Revision App (Scaffold)

This repository is a scaffold for the Beyond Chats revision app assignment.

What's included:
- Frontend: Vite + React + TypeScript (in `frontend/`)
- Backend: Express + TypeScript (in `server/`)
- Sample `data/` folder for PDFs (placeholders — add NCERT PDFs manually)

Run (Windows PowerShell):

```powershell
# install root dev tools
npm install
# install frontend and server deps
cd frontend; npm install; cd ..\server; npm install; cd ..
npm run dev
```

Notes:
- I couldn't fetch NCERT PDFs automatically; add `*.pdf` files into `data/`.
- Next: scaffold frontend and server source files and Tailwind config.
