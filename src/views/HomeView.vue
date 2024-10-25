<script setup lang="ts">
import { EventBus } from '../components/EventBus';
import { ref } from 'vue';

const message = ref('');

const person = ref({
  name: 'John Doe',
  age: 30
});

const sendMessage = () => {
  EventBus.publish('message', { text: message, person: person });
}

const sendEvent = () => {
  EventBus.publish('myEvent', 'Hello from the Event Bus!');
}

const mutatePerson = () => {
  person.value.name = 'Jane Doe';
  person.value.age = 25;
  //EventBus.publish('message', { text: message, person: person });
}

EventBus.setDebugMode(true);
</script>

<template>
  <div style="display: flex; flex-direction: column; row-gap: 12px;">
    <textarea v-model="message"></textarea>
    <button @click="sendMessage">Send Message</button>
    <button @click="sendEvent">Send Event</button>
    <button @click="mutatePerson">Mutate Person</button>
  </div>
</template>
