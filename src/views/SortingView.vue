<script setup>
import { ref, onUnmounted } from 'vue'
import { bubbleSort, selectionSort, insertionSort, quickSort, mergeSort } from '../algorithms/sorting'

const algorithms = [
  { name: 'Bubble Sort', fn: bubbleSort, complexity: 'O(n²)' },
  { name: 'Selection Sort', fn: selectionSort, complexity: 'O(n²)' },
  { name: 'Insertion Sort', fn: insertionSort, complexity: 'O(n²)' },
  { name: 'Quick Sort', fn: quickSort, complexity: 'O(n log n)' },
  { name: 'Merge Sort', fn: mergeSort, complexity: 'O(n log n)' },
]

const arraySize = ref(30)
const speed = ref(50)
const selectedAlgo = ref(0)
const array = ref([])
const comparing = ref([])
const swapped = ref([])
const sorted = ref([])
const isRunning = ref(false)
const isPaused = ref(false)
const completed = ref(false)

let generator = null
let intervalId = null

function generateArray() {
  stop()
  array.value = Array.from({ length: arraySize.value }, () => Math.floor(Math.random() * 300) + 10)
  comparing.value = []
  swapped.value = []
  sorted.value = []
  completed.value = false
}

function start() {
  if (isRunning.value && !isPaused.value) return
  if (completed.value) generateArray()

  if (isPaused.value) {
    isPaused.value = false
    resume()
    return
  }

  stop()
  isRunning.value = true
  completed.value = false
  comparing.value = []
  swapped.value = []
  sorted.value = []

  const algo = algorithms[selectedAlgo.value]
  generator = algo.fn(array.value)
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
      completed.value = true
      return
    }
    const state = next.value
    array.value = state.array
    comparing.value = state.comparing || []
    swapped.value = state.swapped || []
    sorted.value = state.sorted || []
  }, 1000 / speed.value)
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

function reset() {
  stop()
  generateArray()
}

onUnmounted(() => stop())

generateArray()
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Sorting</h1>
        <p class="page-desc">Visualize how sorting algorithms organize data.</p>
      </div>
      <div class="algo-chip">
        <span class="chip-dot"></span>
        {{ algorithms[selectedAlgo].name }}
        <span class="chip-meta">{{ algorithms[selectedAlgo].complexity }}</span>
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
        <div class="control">
          <label>Size <strong>{{ arraySize }}</strong></label>
          <input type="range" v-model.number="arraySize" min="5" max="100" @change="reset" />
        </div>
        <div class="control">
          <label>Speed <strong>{{ speed }}%</strong></label>
          <input type="range" v-model.number="speed" min="1" max="100" />
        </div>
      </div>
      <div class="toolbar-actions">
        <button @click="start" :disabled="isRunning && !isPaused" class="action-btn primary">
          <svg v-if="!isPaused" viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><polygon points="5,3 17,10 5,17"/></svg>
          <svg v-else viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><polygon points="5,3 17,10 5,17"/></svg>
          {{ isPaused ? 'Resume' : 'Start' }}
        </button>
        <button @click="pause" :disabled="!isRunning || isPaused" class="action-btn">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><rect x="4" y="3" width="4" height="14"/><rect x="12" y="3" width="4" height="14"/></svg>
          Pause
        </button>
        <button @click="reset" class="action-btn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M3 10a7 7 0 1 1 7 7"/><path d="M3 10l4-4M3 10l4 4"/></svg>
          Reset
        </button>
        <button @click="generateArray" :disabled="isRunning" class="action-btn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M10 3v4l3 2"/><path d="M4 10a6 6 0 1 1 2 4"/></svg>
          New Array
        </button>
      </div>
    </div>

    <div class="viz-container">
      <div class="bars">
        <div
          v-for="(val, idx) in array"
          :key="idx"
          class="bar"
          :style="{ height: val + 'px' }"
          :class="{
            comparing: comparing.includes(idx),
            swapped: swapped.includes(idx),
            sorted: sorted.includes(idx),
            default: !comparing.includes(idx) && !swapped.includes(idx) && !sorted.includes(idx)
          }"
        >
          <span class="bar-label" v-if="arraySize <= 35">{{ val }}</span>
        </div>
      </div>
    </div>

    <div class="legend">
      <div class="legend-item"><span class="swatch neutral"></span> Default</div>
      <div class="legend-item"><span class="swatch compare"></span> Comparing</div>
      <div class="legend-item"><span class="swatch swap"></span> Swapping</div>
      <div class="legend-item"><span class="swatch sorted"></span> Sorted</div>
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
  background: var(--bg-elevated);
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
.chip-meta {
  color: var(--text-muted);
  font-size: 0.7rem;
  padding: 1px 6px;
  background: var(--bg-secondary);
  border-radius: 4px;
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
.control label strong {
  color: var(--text-secondary);
  margin-left: 4px;
  font-weight: 600;
}
select {
  width: 160px;
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
.toolbar-actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  transition: all 0.15s ease;
}
.action-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--text-primary);
  background: var(--accent-glow);
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

.viz-container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 28px 16px 16px;
  min-height: 370px;
  display: flex;
  align-items: flex-end;
}
.bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
  height: 320px;
  padding-bottom: 8px;
}
.bar {
  flex: 1;
  min-width: 3px;
  border-radius: 3px 3px 0 0;
  transition: height 0.08s ease, background 0.15s ease, transform 0.1s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  cursor: crosshair;
}
.bar:hover {
  transform: scaleY(1.02);
  transform-origin: bottom;
}
.bar-label {
  position: absolute;
  top: -18px;
  font-size: 0.6rem;
  color: var(--text-muted);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.bar.default {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-subtle);
}
.bar.comparing {
  background: var(--amber);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
}
.bar.swapped {
  background: var(--rose);
  box-shadow: 0 0 8px rgba(244, 63, 94, 0.3);
}
.bar.sorted {
  background: var(--green);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.3);
}

.legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px 20px;
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
.swatch.neutral { background: var(--bg-elevated); border: 1px solid var(--border-subtle); }
.swatch.compare { background: var(--amber); }
.swatch.swap { background: var(--rose); }
.swatch.sorted { background: var(--green); }
</style>
