export function createEventBus() {
  const bus = reactive(new Map())
  return {
    subscribe(event, callback) {
      if (!bus.has(event)) {
        bus.set(event, [])
      }
      bus.get(event).push(callback)
    },
    unsubscribe(event, callback) {
      const subscribers = bus.get(event) || []
      bus.set(
        event,
        subscribers.filter(sub => sub !== callback),
      )
    },
    publish(event, payload) {
      const subscribers = bus.get(event) || []
      subscribers.forEach(callback => {
        try {
          callback(payload)
        } catch (error) {
          console.error(`[ScopedBus] Error in event "${event}":`, error)
        }
      })
    },
  }
}

export const userEventBus = createEventBus()
