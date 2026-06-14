# VectorShift — Frontend Technical Assessment

## Setup

```bash
# Frontend
cd frontend && npm install && npm start      # http://localhost:3000

# Backend
cd backend && pip install fastapi uvicorn
uvicorn main:app --reload                    # http://localhost:8000
```

---

## Part 1 — Node Abstraction

**Problem:** All four original nodes (Input, Output, LLM, Text) had nearly identical structure — same wrapper div, same handle logic, same field boilerplate — just repeated in each file.

**Solution:** Built a `BaseNode` component that accepts a config object: a title, an array of input handles, an array of output handles, and an array of field definitions. `BaseNode` handles all the rendering, handle positioning, and field logic in one place. Each node file is now just a thin config passed into `BaseNode`.

**Five new nodes added:** Math, Filter, Timer, Branch, Notes — each one is just a config object, no new boilerplate.

---

## Part 2 — Styling

**Problem:** No styling applied to the original files.

**Solution:** Built a unified dark theme using CSS variables for colors, spacing, and border radius. Applied at the `BaseNode` level so all nine nodes inherit the same card shape, title bar, field styling, and handle dots automatically. Also styled the toolbar, canvas background, zoom controls, minimap, and connector edges (glowing purple/blue lines).

---

## Part 3 — Text Node Logic

**Problem:** Fixed-size text input with no dynamic behaviour.

**Solution (resize):** On every keystroke, the textarea height resets to `auto` then gets set to its `scrollHeight` — so it always fits exactly what's typed with no internal scrollbar.

**Solution (variables):** A regex `/\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g` runs on every text change, extracts unique variable names, and stores them in state. Each variable becomes a left-side Handle on the node. `useUpdateNodeInternals` is called after every change so React Flow recalculates connection points. Handles disappear when their variable is removed from the text.

---

## Part 4 — Backend Integration

**Problem:** Submit button did nothing; `/pipelines/parse` was a stub.

**Solution (frontend):** `submit.js` pulls the current nodes and edges from Zustand store and POSTs them as JSON to `http://localhost:8000/pipelines/parse`. On response, an alert shows the three values in a readable format.

**Solution (backend):** `/pipelines/parse` accepts `{ nodes, edges }`, returns `num_nodes`, `num_edges`, and `is_dag`. The DAG check uses Kahn's algorithm — if every node can be processed in topological order with no cycle, it returns `true`. CORS middleware added so the frontend can reach the backend.

---

## Tech Stack & Tools

### Languages
- **JavaScript / React** — frontend
- **Python** — backend

### Frontend Libraries
- **React Flow** — canvas, nodes, edges, handles, zoom, pan, minimap
- **Zustand** — global state management for nodes and edges
- **CSS Variables** — design system (colors, spacing, radius, theming)

### Backend Libraries
- **FastAPI** — API framework
- **Uvicorn** — ASGI server to run FastAPI
- **Pydantic** — request body validation

### Dev Tools
- **npm** — frontend package management
- **pip** — backend package management
- **Git** — version control

---

## Beyond the Brief

Features I identified as natural extensions but didn't implement within the assessment scope:

- **Delete node / disconnect edge** — right-click context menu on any node or edge, calling `setNodes`/`setEdges` with the target id filtered out

---

## Further Improvements

- Right-click context menu for deleting nodes and disconnecting edges
- Undo / redo support (Zustand with history middleware)
- Save and load pipelines (localStorage or backend persistence)
- Node search / filter in the toolbar for when the node list grows large
- Animated edge flow to show data moving through the pipeline visually
- Validation before submit — warn if required fields are empty or if nodes are unconnected
- Mobile / touch support for the canvas