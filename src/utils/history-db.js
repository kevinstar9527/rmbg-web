const DB_NAME = 'rmbg_history_db'
const HISTORY_STORE = 'history'
const RESULTS_STORE = 'processed_results'
const DB_VERSION = 2

let dbInstance = null

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function openDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance)
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
      if (!db.objectStoreNames.contains(RESULTS_STORE)) {
        db.createObjectStore(RESULTS_STORE, { keyPath: 'id' })
      }
    }
  })
}

export async function addHistory(item) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE], 'readwrite')
    const store = transaction.objectStore(HISTORY_STORE)
    const request = store.add(item)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllHistory() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE], 'readonly')
    const store = transaction.objectStore(HISTORY_STORE)
    const index = store.index('timestamp')
    const request = index.openCursor(null, 'prev')
    const results = []

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        resolve(results)
      }
    }

    request.onerror = () => reject(request.error)
  })
}

export async function clearHistory() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE], 'readwrite')
    const store = transaction.objectStore(HISTORY_STORE)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function saveProcessedResults(results) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESULTS_STORE], 'readwrite')
    const store = transaction.objectStore(RESULTS_STORE)
    const id = generateId()
    const request = store.add({ id, results, timestamp: Date.now() })

    request.onsuccess = () => resolve(id)
    request.onerror = () => reject(request.error)
  })
}

export async function getProcessedResults(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESULTS_STORE], 'readonly')
    const store = transaction.objectStore(RESULTS_STORE)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result?.results || null)
    request.onerror = () => reject(request.error)
  })
}
