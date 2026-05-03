<script setup>
import { ref, onUnmounted } from 'vue'
import { bfs, dfs, dijkstra, astar, createGrid } from '../algorithms/pathfinding'

const ROWS = 20
const COLS = 35

const algorithms = [
  { name: 'BFS', fn: bfs },
  { name: 'DFS', fn: dfs },
  { name: 'Dijkstra', fn: dijkstra },
  { name: 'A*', fn: astar },
]

const grid = ref(createGrid(ROWS, COLS))
const selectedAlgo = ref(0)
const startPos = ref([10, 5])
const endPos = ref([10, 29])
const isRunning = ref(false)
const isPaused = ref(false)
const visitedOrder = ref([])
const path = ref([])
const mouseMode = ref('wall')
const isMouseDown = ref(false)

let generator = null
let intervalId = null

function resetGrid() {
  stop()
  grid.value = createGrid(ROWS, COLS)
  visitedOrder.value = []
  path.value = []
}

function clearWalls() {
  stop()
  grid.value = grid.value.map(row => row.map(cell => ({ ...cell, isWall: false })))
  visitedOrder.value = []
  path.value = []
}

function setStart(r, c) {
  startPos.value = [r, c]
}

function setEnd(r, c) {
  endPos.value = [r, c]
}

function handleCellMouseDown(r, c) {
  isMouseDown.value = true
  if (mouseMode.value === 'start') {
    setStart(r, c)
  } else if (mouseMode.value === 'end') {
    setEnd(r, c)
  } else {
    toggleWall(r, c)
  }
}

function handleCellMouseEnter(r, c) {
  if (!isMouseDown.value) return
  if (mouseMode.value === 'wall') {
    toggleWall(r, c)
  }
}

function handleCellMouseUp() {
  isMouseDown.value = false
}

function toggleWall(r, c) {
  if ((r === startPos.value[0] && c === startPos.value[1]) ||
      (r === endPos.value[0] && c === endPos.value[1])) return
  const newGrid = [...grid.value]
  newGrid[r] = [...newGrid[r]]
  newGrid[r][c] = { ...newGrid[r][c], isWall: !newGrid[r][c].isWall }
  grid.value = newGrid
}

function start() {
  if (isRunning.value && !isPaused.value) return

  if (isPaused.value) {
    isPaused.value = false
    resume()
    return
  }

  stop()
  isRunning.value = true
  visitedOrder.value = []
  path.value = []

  const algo = algorithms[selectedAlgo.value]
  generator = algo.fn(grid.value, startPos.value, endPos.value)
  resume()
}

function resume() {
  intervalId = setInterval(() => {
    if (!generator) return
    const next = generator.next()
    if (next.done) {
      clearInterval(intervalId)
      intervalId = null
      isRunning.value = false
      return
    }
    const state = next.value
    visitedOrder.value = state.visitedOrder || []
    path.value = state.path || []
  }, 30)
}

function pause() {
  isPaused.value = true
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function stop() {
  isRunning.value = false
  isPaused.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  generator = null
}

onUnmounted(() => stop())

function isVisited(r, c) {
  return visitedOrder.value.some(([vr, vc]) => vr === r && vc === c)
}

function isPath(r, c) {
  return path.value.some(([pr, pc]) => pr === r && pc === c)
}

function cellClass(r, c) {
  if (r === startPos.value[0] && c === startPos.value[1]) return 'start'
  if (r === endPos.value[0] && c === endPos.value[1]) return 'end'
  if (grid.value[r][c].isWall) return 'wall'
  if (isPath(r, c)) return 'path'
  if (isVisited(r, c)) return 'visited'
  return ''
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Pathfinding</h1>
        <p class="page-desc">Draw walls and watch algorithms find the shortest path.</p>
      </div>
      <div class="algo-chip">
        <span class="chip-dot"></span>
        {{ algorithms[selectedAlgo].name }}
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <div class="control">
          <label>Algorithm</label>
          <select v-model="selectedAlgo">
            <option v-for="(algo, idx) in algorithms" :key="idx" :value="idx">
              {{ algo.name }}
            </option>
          </select>
        </div>
        <div class="mode-group">
          <label>Mode</label>
          <div class="mode-btns">
            <button
              @click="mouseMode = 'wall'"
              :class="['mode-btn', { active: mouseMode === 'wall' }]"
            >Wall</button>
            <button
              @click="mouseMode = 'start'"
              :class="['mode-btn', { active: mouseMode === 'start' }]"
            >Start</button>
            <button
              @click="mouseMode = 'end'"
              :class="['mode-btn', { active: mouseMode === 'end' }]"
            >End</button>
          </div>
        </div>
      </div>
      <div class="toolbar-actions">
        <button @click="start" :disabled="isRunning && !isPaused" class="action-btn primary">
          <svg v-if="!isPaused" viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><polygon points="5,3 17,10 5,17"/></svg>
          <svg v-else viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><polygon points="5,3 17,10 5,17"/></svg>
          {{ isPaused ? 'Resume' : 'Start' }}
        </button>
        <button @click="pause" :disabled="!isRunning || isPaused" class="action-btn">
          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><rect x="4" y="3" width="4" height="14"/><rect x="12" y="3" width="4" height="14"/></svg>
          Pause
        </button>
        <button @click="resetGrid" class="action-btn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><path d="M3 10a7 7 0 1 1 7 7"/><path d="M3 10l4-4M3 10l4 4"/></svg>
          Reset
        </button>
        <button @click="clearWalls" class="action-btn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M8 8l4 4M12 8l-4 4"/></svg>
          Clear
        </button>
      </div>
    </div>

    <div class="grid-wrapper">
      <div class="grid">
        <div v-for="(row, r) in grid" :key="r" class="grid-row">
          <div
            v-for="(cell, c) in row"
            :key="c"
            class="cell"
            :class="cellClass(r, c)"
            @mousedown.prevent="handleCellMouseDown(r, c)"
            @mouseenter="handleCellMouseEnter(r, c)"
            @mouseup="handleCellMouseUp"
          ></div>
        </div>
      </div>
    </div>

    <div class="legend-bar">
      <div class="legend-item"><span class="swatch start"></span> Start</div>
      <div class="legend-item"><span class="swatch end"></span> End</div>
      <div class="legend-item"><span class="swatch wall"></span> Wall</div>
      <div class="legend-item"><span class="swatch visited"></span> Visited</div>
      <div class="legend-item"><span class="swatch path"></span> Path</div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.page-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}
.page-desc {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.algo-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  padding: 20px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}
.toolbar-left {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}
.control {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.control label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
}
select {
  width: 140px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
  transition: border-color 0.2s;
}
select:focus {
  outline: none;
  border-color: var(--accent);
}
.mode-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mode-btns {
  display: flex;
  gap: 2px;
  background: var(--bg-elevated);
  border-radius: 8px;
  padding: 3px;
  border: 1px solid var(--border-subtle);
}
.mode-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 500;
  transition: all 0.15s ease;
  font-family: var(--font);
}
.mode-btn.active {
  background: var(--accent);
  color: white;
}
.toolbar-actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.78rem;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  transition: all 0.15s ease;
  font-family: var(--font);
}
.action-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--text-primary);
}
.action-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.action-btn.primary {
  background: var(--accent);
  color: white;
  border-color: transparent;
}
.action-btn.primary:hover:not(:disabled) {
  background: var(--accent-light);
}
.grid-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px;
  overflow: auto;
}
.grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 auto;
  width: fit-content;
}
.grid-row {
  display: flex;
  gap: 2px;
}
.cell {
  width: 22px;
  height: 22px;
  background: var(--bg-elevated);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.1s ease, transform 0.08s ease;
  border: 1px solid transparent;
}
.cell:hover {
  transform: scale(1.1);
}
.cell.wall {
  background: var(--text-muted);
  border-color: rgba(92, 96, 128, 0.3);
}
.cell.start {
  background: var(--green);
  border-color: rgba(52, 211, 153, 0.4);
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.25);
}
.cell.end {
  background: var(--rose);
  border-color: rgba(244, 63, 94, 0.4);
  box-shadow: 0 0 6px rgba(244, 63, 94, 0.25);
}
.cell.visited {
  background: var(--accent);
  animation: visitAnim 0.2s ease forwards;
}
.cell.path {
  background: var(--cyan);
  animation: pathAnim 0.3s ease forwards;
}
@keyframes visitAnim {
  from { transform: scale(0.6); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes pathAnim {
  0% { transform: scale(0.5); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.legend-bar {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}
.swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.swatch.start { background: var(--green); }
.swatch.end { background: var(--rose); }
.swatch.wall { background: var(--text-muted); }
.swatch.visited { background: var(--accent); }
.swatch.path { background: var(--cyan); }
</style>
