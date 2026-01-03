<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';
import { MoneyEvents } from '../shared/events';
import { formatMoney } from '../shared/utils';

const events = useEvents();
const money = ref(0);

function updateMoney(newMoney: number) {
    money.value = newMoney;
}

onMounted(() => {
    events.on(MoneyEvents.toWebview.updateMoney, updateMoney);
    
    // Request current money when component mounts to get the real value
    events.emitServer(MoneyEvents.toServer.requestMoney);
});
</script>

<template>
    <div class="fixed bottom-32 left-6 pointer-events-none">
        <div class="flex items-center gap-3 rounded-lg bg-black bg-opacity-60 px-4 py-3 backdrop-blur-sm">
            <div class="flex items-center justify-center rounded-full bg-green-600 p-2">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <div class="flex flex-col">
                <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Argent</span>
                <span class="text-xl font-bold text-white">{{ formatMoney(money) }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
