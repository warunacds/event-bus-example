// Main event bus using a WeakMap for memory efficiency
import { reactive, ref } from 'vue'
const eventBus = new Map() //reactive(new WeakMap())

// Event queue for batching events
const eventQueue: { event: string; payload: unknown }[] = []
let debugMode = false

function processQueue() {
  while (eventQueue.length > 0) {
    const eventItem = eventQueue.shift()
    if (eventItem) {
      const { event, payload } = eventItem

      const subscribers = eventBus.get(event) || []
      subscribers.forEach((callback: (payload: unknown) => void) => {
        try {
          callback(payload)
        } catch (error) {
          console.error(`[EventBus] Error in event "${event}":`, error)
        }
      })
    }
  }
}

// EventBus API
export const EventBus = {
  setDebugMode(value: boolean) {
    debugMode = value
  },

  // subscribe(event: string, callback: (payload: unknown) => void) {
  //   const namespacedEvent = `${event}`
  //   if (!eventBus.has(namespacedEvent)) {
  //     eventBus.set(namespacedEvent, [])
  //   }
  //   eventBus.get(namespacedEvent).push(callback)

  //   if (debugMode) {
  //     console.log(`[EventBus] Subscribed to event: ${namespacedEvent}`)
  //   }
  // },

  subscribe(event: string) {
    // Create a reactive ref to hold the event payload
    const payload = ref(null)

    // Create a callback to update the payload whenever the event is published
    const callback = (data: never) => {
      payload.value = data
    }

    // Subscribe to the event
    if (!eventBus.has(event)) {
      eventBus.set(event, [])
    }
    eventBus.get(event).push(callback)

    // Return the reactive payload
    return payload
  },

  unsubscribe(event: string) {
    const namespacedEvent = `${event}`
    if (eventBus.has(namespacedEvent)) {
      eventBus.delete(namespacedEvent)
    }

    if (debugMode) {
      console.log(`[EventBus] Unsubscribed from event: ${namespacedEvent}`)
    }
  },

  publish(event: string, payload: unknown) {
    const namespacedEvent = `${event}`
    if (eventBus.has(namespacedEvent)) {
      eventQueue.push({ event: namespacedEvent, payload })

      if (eventQueue.length === 1) {
        setTimeout(processQueue, 0) // Batching events together
      }

      if (debugMode) {
        console.log(`[EventBus] Event published: ${namespacedEvent}`, payload)
      }
    } else {
      console.warn(
        `[EventBus] No subscribers found for event: ${namespacedEvent}. Won't be published.`,
      )
    }
  },
}

// Lazy subscription utility
export function lazySubscribe(
  event: string,
  callback: (payload: unknown) => void,
  conditionFn: () => boolean,
) {
  // const condition = conditionFn()
  // debugger
  // if (condition) {
  //   EventBus.subscribe(event, callback)
  // } else {
  //   // You could store the callback for future subscription if needed
  //   console.log(`[EventBus] Lazy subscription skipped for event: ${event}`)
  // }
  let isSubscribed = false

  const checkSubscription = () => {
    const condition = conditionFn()

    if (condition && !isSubscribed) {
      EventBus.subscribe(event)
      isSubscribed = true
    } else if (!condition && isSubscribed) {
      EventBus.unsubscribe(event)
      isSubscribed = false
    }
  }
  checkSubscription()
  return checkSubscription
}
