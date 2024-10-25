<template>
    <div style="display: flex; flex-direction: column; row-gap: 16px;">
        <p> Component Second </p>
        <button @click="toggleVisibility">Toggle Component Visibility</button>
        <div v-if="isComponentVisible">
            <!-- <h1>Hello World Component</h1> -->

        </div>
        <p>Message: {{ message }}</p>
        <button @click="clear">Clear Message</button>
        <button @click="unsub">Unsusbcribe</button>
    </div>
</template>

<script lang="ts">

import { ref, watch } from 'vue';
import { lazySubscribe, EventBus } from './EventBus';

export default {
    setup() {
        const message = ref('');
        const isComponentVisible = ref(false); // Component initially hidden

        // Condition function
        function shouldSubscribe() {
            return isComponentVisible.value;
        }

        // Watch visibility change and subscribe only when it's visible
        // watch(isComponentVisible, (newValue) => {
        //     if (newValue) {
        //         lazySubscribe('myEvent', (payload) => {
        //             message.value = payload;
        //         }, shouldSubscribe);
        //     }
        // });
        const checkSubscription = lazySubscribe('myEvent', (payload) => {
            message.value = payload;
        }, shouldSubscribe);

        // Watch the visibility change and check the subscription status accordingly
        watch(isComponentVisible, () => {
            checkSubscription(); // Recheck the subscription whenever the condition changes
        });

        const toggleVisibility = () => {
            isComponentVisible.value = !isComponentVisible.value;
        };

        const unsub = () => {
            EventBus.unsubscribe('message');
        };

        const clear = () => {
            message.value = '';
        }

        return { message, isComponentVisible, toggleVisibility, unsub, clear };
    },
};
</script>
