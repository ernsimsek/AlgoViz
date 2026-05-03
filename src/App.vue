<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <svg class="brand-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span class="brand-name">AlgoViz</span>
      </div>
      <nav class="nav">
        <RouterLink to="/" class="nav-item">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z"/>
          </svg>
          Sorting
        </RouterLink>
        <RouterLink to="/pathfinding" class="nav-item">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M10 2l8 4v8l-8 4-8-4V6l8-4z"/>
          </svg>
          Pathfinding
        </RouterLink>
        <RouterLink to="/datastructure" class="nav-item">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <circle cx="10" cy="5" r="3"/><circle cx="5" cy="15" r="3"/><circle cx="15" cy="15" r="3"/>
            <line x1="10" y1="8" x2="5" y2="12" stroke="currentColor" stroke-width="1.5"/>
            <line x1="10" y1="8" x2="15" y2="12" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Structures
        </RouterLink>
      </nav>
      <div class="topbar-right">
        <span class="badge">Vue 3</span>
      </div>
    </header>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  background: rgba(10, 11, 20, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo {
  width: 26px;
  height: 26px;
  color: var(--accent);
}
.brand-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}
.nav {
  display: flex;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.nav-item:hover {
  color: var(--text-secondary);
  background: var(--bg-elevated);
}
.nav-item.router-link-active {
  color: var(--accent-light);
  background: var(--accent-glow);
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}
.main {
  flex: 1;
  padding: 40px 32px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
