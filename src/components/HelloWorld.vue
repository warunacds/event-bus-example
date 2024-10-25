<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import { EventBus } from './EventBus';

// const message = ref('');

// const subscribe = () => {
//   EventBus.subscribe('message', (payload) => {
//     message.value = payload;
//   });

// };
const message = EventBus.subscribe('message');

// EventBus.publish('message', message.value);

const unsubscribe = () => {
  EventBus.unsubscribe('message');

};

</script>

<template>
  <div style="display: flex; flex-direction: column; row-gap: 20px;">
    <p>Component First</p>
    <!-- <button @click="subscribe">Subscribe</button> -->
    <button @click="unsubscribe">Unsubscribe</button>
    <div v-if="message">
      <p>{{ message }}</p>

    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
