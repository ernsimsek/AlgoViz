<script setup>
import { ref } from 'vue'
import TreeNode from '../components/TreeNode.vue'

const structures = ['Stack', 'Queue', 'LinkedList', 'Tree']
const selected = ref(0)

// Stack
const stack = ref([])
const stackInput = ref('')
function stackPush() {
  if (stackInput.value) {
    stack.value.push(stackInput.value)
    stackInput.value = ''
  }
}
function stackPop() {
  stack.value.pop()
}

// Queue
const queue = ref([])
const queueInput = ref('')
function queueEnqueue() {
  if (queueInput.value) {
    queue.value.push(queueInput.value)
    queueInput.value = ''
  }
}
function queueDequeue() {
  queue.value.shift()
}

// LinkedList
const listNodes = ref([{ id: 1, val: 'A' }, { id: 2, val: 'B' }, { id: 3, val: 'C' }])
const listInput = ref('')
let nextId = 4
function listInsertHead() {
  if (listInput.value) {
    listNodes.value.unshift({ id: nextId++, val: listInput.value })
    listInput.value = ''
  }
}
function listInsertTail() {
  if (listInput.value) {
    listNodes.value.push({ id: nextId++, val: listInput.value })
    listInput.value = ''
  }
}
function listRemoveHead() {
  listNodes.value.shift()
}
function listRemoveTail() {
  listNodes.value.pop()
}

// Tree
const tree = ref({
  val: 'A',
  left: {
    val: 'B',
    left: { val: 'D', left: null, right: null },
    right: { val: 'E', left: null, right: null },
  },
  right: {
    val: 'C',
    left: { val: 'F', left: null, right: null },
    right: { val: 'G', left: null, right: null },
  },
})

const treeInsertVal = ref('')
function treeInsert() {
  if (!treeInsertVal.value) return
  const newVal = treeInsertVal.value
  treeInsertVal.value = ''
  function insert(node, val) {
    if (!node) return { val, left: null, right: null }
    if (val < node.val) node.left = insert(node.left, val)
    else node.right = insert(node.right, val)
    return node
  }
  const newTree = JSON.parse(JSON.stringify(tree.value))
  insert(newTree, newVal)
  tree.value = newTree
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Data Structures</h1>
        <p class="page-desc">Interactive visualization of fundamental data structures.</p>
      </div>
      <div class="tab-group">
        <button
          v-for="(s, i) in structures"
          :key="i"
          :class="['tab', { active: selected === i }]"
          @click="selected = i"
        >{{ s }}</button>
      </div>
    </div>

    <div class="panel">
      <!-- Stack -->
      <div v-if="selected === 0" class="structure-block">
        <div class="ops-bar">
          <input v-model="stackInput" placeholder="Value" class="ds-input" @keyup.enter="stackPush" />
          <button @click="stackPush" class="op-btn accent">Push</button>
          <button @click="stackPop" class="op-btn danger">Pop</button>
        </div>
        <div class="stack-area">
          <div v-if="stack.length === 0" class="empty-state">
            Stack is empty
          </div>
          <TransitionGroup name="stack" tag="div" class="stack-items">
            <div v-for="(item, idx) in [...stack].reverse()" :key="item + '-' + idx" class="stack-card">
              <span class="card-idx">{{ stack.length - 1 - idx }}</span>
              <span class="card-val">{{ item }}</span>
            </div>
          </TransitionGroup>
          <div class="stack-base">TOP</div>
        </div>
      </div>

      <!-- Queue -->
      <div v-if="selected === 1" class="structure-block">
        <div class="ops-bar">
          <input v-model="queueInput" placeholder="Value" class="ds-input" @keyup.enter="queueEnqueue" />
          <button @click="queueEnqueue" class="op-btn accent">Enqueue</button>
          <button @click="queueDequeue" class="op-btn danger">Dequeue</button>
        </div>
        <div class="queue-area">
          <div v-if="queue.length === 0" class="empty-state">
            Queue is empty
          </div>
          <TransitionGroup name="queue" tag="div" class="queue-items">
            <div v-for="(item, idx) in queue" :key="item + '-' + idx" class="queue-card">
              <span class="card-val">{{ item }}</span>
              <span v-if="idx === 0" class="q-label front">FRONT</span>
              <span v-if="idx === queue.length - 1" class="q-label rear">REAR</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- LinkedList -->
      <div v-if="selected === 2" class="structure-block">
        <div class="ops-bar">
          <input v-model="listInput" placeholder="Value" class="ds-input" @keyup.enter="listInsertTail" />
          <button @click="listInsertHead" class="op-btn accent">Head</button>
          <button @click="listInsertTail" class="op-btn accent">Tail</button>
          <button @click="listRemoveHead" class="op-btn danger">Pop Head</button>
          <button @click="listRemoveTail" class="op-btn danger">Pop Tail</button>
        </div>
        <div class="ll-area">
          <div v-if="listNodes.length === 0" class="empty-state">
            List is empty
          </div>
          <div v-else class="ll-items">
            <template v-for="(node, idx) in listNodes" :key="node.id">
              <div class="ll-node">
                <span class="card-val">{{ node.val }}</span>
              </div>
              <span v-if="idx < listNodes.length - 1" class="ll-arrow">→</span>
            </template>
          </div>
        </div>
      </div>

      <!-- Tree -->
      <div v-if="selected === 3" class="structure-block">
        <div class="ops-bar">
          <input v-model="treeInsertVal" placeholder="Value (A-Z)" class="ds-input" @keyup.enter="treeInsert" />
          <button @click="treeInsert" class="op-btn accent">Insert</button>
        </div>
        <div class="tree-area">
          <div class="tree-wrapper" v-if="tree">
            <TreeNode :node="tree" />
          </div>
        </div>
      </div>
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
  gap: 20px;
  flex-wrap: wrap;
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
.tab-group {
  display: flex;
  gap: 2px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 3px;
}
.tab {
  padding: 7px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.82rem;
  font-family: var(--font);
  transition: all 0.15s ease;
}
.tab:hover {
  color: var(--text-secondary);
}
.tab.active {
  background: var(--accent);
  color: white;
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px;
  min-height: 250px;
}
.structure-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.ops-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.ds-input {
  width: 140px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-family: var(--font);
  transition: border-color 0.15s;
}
.ds-input:focus {
  outline: none;
  border-color: var(--accent);
}
.op-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.78rem;
  font-family: var(--font);
  transition: all 0.15s ease;
}
.op-btn.accent {
  background: var(--accent);
  color: white;
}
.op-btn.accent:hover {
  background: var(--accent-light);
}
.op-btn.danger {
  background: var(--bg-elevated);
  color: var(--rose);
  border: 1px solid rgba(244, 63, 94, 0.2);
}
.op-btn.danger:hover {
  background: rgba(244, 63, 94, 0.1);
}

/* Stack */
.stack-area {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 4px;
  padding: 20px;
  min-height: 180px;
  justify-content: flex-end;
}
.stack-items {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 4px;
}
.stack-card {
  width: 220px;
  padding: 12px 16px;
  background: var(--accent);
  color: white;
  text-align: center;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}
.card-idx {
  font-size: 0.65rem;
  background: rgba(255,255,255,0.15);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.card-val {
  font-size: 0.9rem;
}
.stack-base {
  width: 240px;
  padding: 6px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  text-align: center;
  border-radius: 0 0 8px 8px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-top: 4px;
  border: 1px solid var(--border-subtle);
  border-top: none;
}
.stack-enter-active { animation: slideIn 0.2s ease; }
.stack-leave-active { animation: slideOut 0.2s ease; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
}

/* Queue */
.queue-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  min-height: 150px;
  overflow-x: auto;
}
.queue-items {
  display: flex;
  gap: 6px;
  align-items: flex-end;
}
.queue-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.queue-card .card-val {
  padding: 12px 18px;
  background: var(--green);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(52, 211, 153, 0.2);
}
.q-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 2px 6px;
  border-radius: 4px;
}
.q-label.front { color: var(--amber); background: rgba(251, 191, 36, 0.1); }
.q-label.rear { color: var(--accent-light); background: var(--accent-glow); }

.queue-enter-active { animation: queueIn 0.2s ease; }
.queue-leave-active { animation: queueOut 0.2s ease; }
@keyframes queueIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes queueOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(10px); }
}

/* LinkedList */
.ll-area {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 20px;
  overflow-x: auto;
}
.ll-items {
  display: flex;
  align-items: center;
  gap: 0;
}
.ll-node {
  padding: 12px 18px;
  background: var(--rose);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(244, 63, 94, 0.2);
}
.ll-arrow {
  padding: 0 10px;
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: 700;
}

/* Tree */
.tree-area {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  overflow: auto;
}
.tree-wrapper {
  display: flex;
  justify-content: center;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
