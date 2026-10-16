// Two small guards for async UI work.

// Out-of-order responses: every request takes a ticket; only the newest ticket
// may write to state. Call invalidate() when the inputs change so an in-flight
// response for the OLD inputs is ignored when it lands.
export function makeLatestGuard() {
  let latest = 0
  return {
    next() { return ++latest },
    isCurrent(ticket) { return ticket === latest },
    invalidate() { latest++ },
  }
}

// Duplicate submits: while one run is in flight, further calls are dropped
// (resolve to undefined). Works even when two clicks land before React re-renders.
export function makeSingleFlight() {
  let busy = false
  return async function run(fn) {
    if (busy) return undefined
    busy = true
    try { return await fn() } finally { busy = false }
  }
}
