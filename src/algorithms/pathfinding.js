// Yol bulma algoritmaları - grid üzerinde adım adım çalışır

const DIRS = [
  [0, -1], [0, 1], [-1, 0], [1, 0], // up, down, left, right
]

function isValid(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && !grid[row][col].isWall
}

// BFS
export function* bfs(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null))
  const queue = [start]
  visited[start[0]][start[1]] = true
  const visitedOrder = []

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    visitedOrder.push([r, c])
    yield { visitedOrder: [...visitedOrder], path: [] }

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end)
      yield { visitedOrder: [...visitedOrder], path }
      return
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (isValid(grid, nr, nc) && !visited[nr][nc]) {
        visited[nr][nc] = true
        parent[nr][nc] = [r, c]
        queue.push([nr, nc])
      }
    }
  }
  yield { visitedOrder: [...visitedOrder], path: [] }
}

// DFS
export function* dfs(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null))
  const stack = [start]
  const visitedOrder = []

  while (stack.length > 0) {
    const [r, c] = stack.pop()
    if (visited[r][c]) continue
    visited[r][c] = true
    visitedOrder.push([r, c])
    yield { visitedOrder: [...visitedOrder], path: [] }

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end)
      yield { visitedOrder: [...visitedOrder], path }
      return
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (isValid(grid, nr, nc) && !visited[nr][nc]) {
        parent[nr][nc] = [r, c]
        stack.push([nr, nc])
      }
    }
  }
  yield { visitedOrder: [...visitedOrder], path: [] }
}

// Dijkstra
export function* dijkstra(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity))
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null))
  const visitedOrder = []

  dist[start[0]][start[1]] = 0
  const pq = [{ r: start[0], c: start[1], d: 0 }]

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d)
    const { r, c, d } = pq.shift()

    if (visited[r][c]) continue
    visited[r][c] = true
    visitedOrder.push([r, c])
    yield { visitedOrder: [...visitedOrder], path: [] }

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end)
      yield { visitedOrder: [...visitedOrder], path }
      return
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (isValid(grid, nr, nc) && !visited[nr][nc]) {
        const nd = d + 1
        if (nd < dist[nr][nc]) {
          dist[nr][nc] = nd
          parent[nr][nc] = [r, c]
          pq.push({ r: nr, c: nc, d: nd })
        }
      }
    }
  }
  yield { visitedOrder: [...visitedOrder], path: [] }
}

// A*
export function* astar(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity))
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null))
  const visitedOrder = []

  gScore[start[0]][start[1]] = 0
  const openSet = [{ r: start[0], c: start[1], f: heuristic(start, end) }]

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f)
    const { r, c } = openSet.shift()

    if (visited[r][c]) continue
    visited[r][c] = true
    visitedOrder.push([r, c])
    yield { visitedOrder: [...visitedOrder], path: [] }

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end)
      yield { visitedOrder: [...visitedOrder], path }
      return
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (isValid(grid, nr, nc) && !visited[nr][nc]) {
        const tentativeG = gScore[r][c] + 1
        if (tentativeG < gScore[nr][nc]) {
          gScore[nr][nc] = tentativeG
          parent[nr][nc] = [r, c]
          const f = tentativeG + heuristic([nr, nc], end)
          openSet.push({ r: nr, c: nc, f })
        }
      }
    }
  }
  yield { visitedOrder: [...visitedOrder], path: [] }
}

function heuristic(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function reconstructPath(parent, end) {
  const path = []
  let cur = end
  while (cur) {
    path.unshift(cur)
    cur = parent[cur[0]][cur[1]]
  }
  return path
}

// Grid oluşturucu
export function createGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      isWall: false,
      isVisited: false,
    }))
  )
}
