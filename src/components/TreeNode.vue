<script setup>
defineProps(['node'])
</script>

<template>
  <div class="tree-node">
    <div class="node">{{ node.val }}</div>
    <div v-if="node.left || node.right" class="children">
      <div v-if="node.left" class="child">
        <div class="edge"></div>
        <TreeNode :node="node.left" />
      </div>
      <div v-if="node.right" class="child">
        <div class="edge"></div>
        <TreeNode :node="node.right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.node {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 1;
}
.node:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}
.children {
  display: flex;
  gap: 40px;
  margin-top: 8px;
}
.child {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edge {
  width: 1px;
  height: 24px;
  background: var(--border-subtle);
  position: relative;
}
.edge::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}
</style>
