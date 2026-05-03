// Sıralama algoritmaları - her adımda dizi durumunu yield eder

// Bubble Sort
export function* bubbleSort(arr) {
  const a = [...arr]
  const n = a.length
  let sorted = new Set()
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted] }
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
        yield { array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted] }
      }
    }
    sorted.add(n - 1 - i)
    yield { array: [...a], comparing: [], swapped: [], sorted: [...sorted] }
    if (!swapped) break
  }
  yield { array: [...a], comparing: [], swapped: [], sorted: Array.from({ length: n }, (_, i) => i) }
}

// Selection Sort
export function* selectionSort(arr) {
  const a = [...arr]
  const n = a.length
  let sorted = []
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparing: [minIdx, j], swapped: [], sorted: [...sorted] }
      if (a[j] < a[minIdx]) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      yield { array: [...a], comparing: [], swapped: [i, minIdx], sorted: [...sorted] }
    }
    sorted.push(i)
    yield { array: [...a], comparing: [], swapped: [], sorted: [...sorted] }
  }
  sorted.push(n - 1)
  yield { array: [...a], comparing: [], swapped: [], sorted: [...sorted] }
}

// Insertion Sort
export function* insertionSort(arr) {
  const a = [...arr]
  const n = a.length
  let sorted = [0]
  yield { array: [...a], comparing: [], swapped: [], sorted: [...sorted] }
  for (let i = 1; i < n; i++) {
    let key = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > key) {
      yield { array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted] }
      a[j + 1] = a[j]
      yield { array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted] }
      j--
    }
    a[j + 1] = key
    sorted = Array.from({ length: i + 1 }, (_, k) => k)
    yield { array: [...a], comparing: [], swapped: [], sorted: [...sorted] }
  }
  yield { array: [...a], comparing: [], swapped: [], sorted: Array.from({ length: n }, (_, i) => i) }
}

// Quick Sort (stack-based for generator)
export function* quickSort(arr) {
  const a = [...arr]
  const n = a.length
  const stack = [{ low: 0, high: n - 1 }]
  const sorted = new Set()

  while (stack.length > 0) {
    const { low, high } = stack.pop()
    if (low >= high) {
      if (low === high) sorted.add(low)
      continue
    }
    let pivotIdx = yield* partition(a, low, high, sorted)
    sorted.add(pivotIdx)
    stack.push({ low, high: pivotIdx - 1 })
    stack.push({ low: pivotIdx + 1, high })
  }
  yield { array: [...a], comparing: [], swapped: [], sorted: Array.from(sorted) }
}

function* partition(a, low, high, sorted) {
  const pivot = a[high]
  let i = low - 1
  for (let j = low; j < high; j++) {
    yield { array: [...a], comparing: [j, high], swapped: [], sorted: Array.from(sorted) }
    if (a[j] < pivot) {
      i++
      ;[a[i], a[j]] = [a[j], a[i]]
      yield { array: [...a], comparing: [], swapped: [i, j], sorted: Array.from(sorted) }
    }
  }
  ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
  yield { array: [...a], comparing: [], swapped: [i + 1, high], sorted: Array.from(sorted) }
  return i + 1
}

// Merge Sort (iterative bottom-up for generator)
export function* mergeSort(arr) {
  const a = [...arr]
  const n = a.length
  const sorted = new Set()
  let size = 1

  while (size < n) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size, n)
      const right = Math.min(left + 2 * size, n)
      yield* merge(a, left, mid, right, sorted)
    }
    size *= 2
  }
  yield { array: [...a], comparing: [], swapped: [], sorted: Array.from({ length: n }, (_, i) => i) }
}

function* merge(a, left, mid, right, sorted) {
  const leftArr = a.slice(left, mid)
  const rightArr = a.slice(mid, right)
  let i = 0, j = 0, k = left

  while (i < leftArr.length && j < rightArr.length) {
    yield { array: [...a], comparing: [left + i, mid + j], swapped: [], sorted: Array.from(sorted) }
    if (leftArr[i] <= rightArr[j]) {
      a[k] = leftArr[i]
      i++
    } else {
      a[k] = rightArr[j]
      j++
    }
    yield { array: [...a], comparing: [], swapped: [k], sorted: Array.from(sorted) }
    k++
  }
  while (i < leftArr.length) {
    a[k] = leftArr[i]
    yield { array: [...a], comparing: [], swapped: [k], sorted: Array.from(sorted) }
    i++; k++
  }
  while (j < rightArr.length) {
    a[k] = rightArr[j]
    yield { array: [...a], comparing: [], swapped: [k], sorted: Array.from(sorted) }
    j++; k++
  }
}
