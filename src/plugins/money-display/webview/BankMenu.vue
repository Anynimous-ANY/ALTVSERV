<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';
import { MoneyEvents } from '../shared/events';
import { formatMoney } from '../shared/utils';

const events = useEvents();
const money = ref(0);
const amount = ref<number | null>(null);
const isProcessing = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | ''>('');

function updateMoney(newMoney: number) {
    money.value = newMoney;
}

function showMessage(msg: string, type: 'success' | 'error') {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => {
        message.value = '';
        messageType.value = '';
    }, 3000);
}

function validateAmount(): boolean {
    if (isProcessing.value || !amount.value || amount.value <= 0) {
        showMessage('Veuillez entrer un montant valide', 'error');
        return false;
    }
    return true;
}

function handleDepositResult(success: boolean, depositedAmount: number) {
    isProcessing.value = false;
    if (success) {
        showMessage(`Dépôt de ${formatMoney(depositedAmount)} effectué avec succès`, 'success');
        amount.value = null;
    } else {
        showMessage('Erreur lors du dépôt', 'error');
    }
}

function handleWithdrawResult(success: boolean, withdrawnAmount: number) {
    isProcessing.value = false;
    if (success) {
        showMessage(`Retrait de ${formatMoney(withdrawnAmount)} effectué avec succès`, 'success');
        amount.value = null;
    } else {
        showMessage('Vous n\'avez pas assez d\'argent en banque', 'error');
    }
}

function handleDeposit() {
    if (!validateAmount()) {
        return;
    }

    if (amount.value! > money.value) {
        showMessage('Vous n\'avez pas assez d\'argent', 'error');
        return;
    }

    const depositAmount = amount.value!;
    isProcessing.value = true;
    events.emitServer(MoneyEvents.toServer.deposit, depositAmount);
}

function handleWithdraw() {
    if (!validateAmount()) {
        return;
    }

    const withdrawAmount = amount.value!;
    isProcessing.value = true;
    events.emitServer(MoneyEvents.toServer.withdraw, withdrawAmount);
}

function handleClose() {
    events.emitServer(MoneyEvents.toServer.closeBank);
}

onMounted(() => {
    events.on(MoneyEvents.toWebview.updateMoney, updateMoney);
    events.on(MoneyEvents.toWebview.depositResult, handleDepositResult);
    events.on(MoneyEvents.toWebview.withdrawResult, handleWithdrawResult);
    
    // Request current money when component mounts
    events.emitServer(MoneyEvents.toServer.requestMoney);
});

onUnmounted(() => {
    // Clean up event listeners if needed
});
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-700 pb-4">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center rounded-full bg-green-600 p-3">
                        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-3xl font-bold text-white">Banque</h2>
                        <p class="text-sm text-gray-400">Gérez votre argent</p>
                    </div>
                </div>
                <button
                    @click="handleClose"
                    class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Balance Display -->
            <div class="rounded-xl bg-gradient-to-r from-green-600 to-green-500 p-6">
                <p class="text-sm font-medium text-green-100 uppercase tracking-wider">Solde actuel</p>
                <p class="mt-2 text-4xl font-bold text-white">{{ formatMoney(money) }}</p>
            </div>

            <!-- Message -->
            <div v-if="message" class="rounded-lg p-4" :class="messageType === 'success' ? 'bg-green-900 bg-opacity-50 text-green-200' : 'bg-red-900 bg-opacity-50 text-red-200'">
                <p class="font-medium">{{ message }}</p>
            </div>

            <!-- Amount Input -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-300 uppercase tracking-wider">Montant</label>
                <input
                    v-model.number="amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Entrez le montant"
                    class="rounded-lg border-2 border-gray-600 bg-gray-800 px-4 py-3 text-lg font-medium text-white outline-none transition-colors placeholder:text-gray-500 focus:border-green-500"
                />
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4">
                <button
                    @click="handleDeposit"
                    :disabled="isProcessing"
                    class="rounded-lg bg-green-600 px-6 py-4 font-bold text-white transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span v-if="!isProcessing">Déposer</span>
                    <span v-else>En cours...</span>
                </button>
                <button
                    @click="handleWithdraw"
                    :disabled="isProcessing"
                    class="rounded-lg bg-blue-600 px-6 py-4 font-bold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span v-if="!isProcessing">Retirer</span>
                    <span v-else>En cours...</span>
                </button>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="flex flex-wrap gap-2">
                <p class="w-full text-sm font-medium text-gray-400 uppercase tracking-wider">Montants rapides</p>
                <button
                    v-for="quickAmount in [100, 500, 1000, 5000, 10000]"
                    :key="quickAmount"
                    @click="amount = quickAmount"
                    class="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                >
                    {{ formatMoney(quickAmount) }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
}
</style>
