# Algorithm Visualizer

A web application built with Vue 3 + Vite that visualizes algorithms step by step.

## Features

### 1. Sorting Algorithms
- Bubble Sort (O(n²))
- Selection Sort (O(n²))
- Insertion Sort (O(n²))
- Quick Sort (O(n log n))
- Merge Sort (O(n log n))

During algorithm execution:
- Compared elements are highlighted in orange
- Swapped elements are highlighted in red
- Sorted elements are highlighted in green

Array size and animation speed are adjustable. Pause/Resume functionality is available.

### 2. Pathfinding Algorithms
- BFS (Breadth-First Search)
- DFS (Depth-First Search)
- Dijkstra
- A* (A-Star)

On a 20x35 grid:
- Walls can be drawn
- Start and end points can be moved
- Visited cells and the shortest path are visualized

### 3. Data Structures
- **Stack**: Push/Pop operations
- **Queue**: Enqueue/Dequeue operations
- **LinkedList**: Insert at beginning/end, delete from beginning/end
- **Tree**: Insert elements into a binary tree (visual tree structure)

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
npm run preview
```

## Technologies
- Vue 3 (Composition API)
- Vite 8
- Vue Router 4
