import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { MoneyEvents } from '../shared/events.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Key for storing money in character document
const MONEY_KEY = 'money';

// Initialize player money display
function initPlayerMoney(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        return;
    }

    // Get current money or set to 0 if not exists
    const currentMoney = document[MONEY_KEY] ?? 0;
    
    // Show the money display overlay
    Rebar.player.useWebview(player).show('MoneyDisplay', 'overlay');
    
    // Send current money to webview
    updatePlayerMoney(player, currentMoney);
}

// Update player money in webview
function updatePlayerMoney(player: alt.Player, amount: number) {
    Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.updateMoney, amount);
}

// Get player money
function getPlayerMoney(player: alt.Player): number {
    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        return 0;
    }
    
    return document[MONEY_KEY] ?? 0;
}

// Set player money
async function setPlayerMoney(player: alt.Player, amount: number): Promise<boolean> {
    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        return false;
    }
    
    // Ensure amount is not negative
    const newAmount = Math.max(0, amount);
    
    // Update in database
    await rPlayer.character.set(MONEY_KEY, newAmount);
    
    // Update webview
    updatePlayerMoney(player, newAmount);
    
    return true;
}

// Add money to player
async function addPlayerMoney(player: alt.Player, amount: number): Promise<boolean> {
    const currentMoney = getPlayerMoney(player);
    return await setPlayerMoney(player, currentMoney + amount);
}

// Remove money from player
async function removePlayerMoney(player: alt.Player, amount: number): Promise<boolean> {
    const currentMoney = getPlayerMoney(player);
    
    if (currentMoney < amount) {
        return false;
    }
    
    return await setPlayerMoney(player, currentMoney - amount);
}

// Handle bank menu open
function handleOpenBank(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        return;
    }
    
    // Get current money
    const currentMoney = getPlayerMoney(player);
    
    // Show bank menu as page
    Rebar.player.useWebview(player).show('BankMenu', 'page');
    
    // Disable game controls
    alt.emitClient(player, MoneyEvents.toClient.openBankMenu);
    
    // Update money display
    updatePlayerMoney(player, currentMoney);
}

// Handle bank menu close
function handleCloseBank(player: alt.Player) {
    // Hide bank menu
    Rebar.player.useWebview(player).hide('BankMenu');
    
    // Enable game controls
    alt.emitClient(player, MoneyEvents.toClient.closeBankMenu);
}

// Handle deposit
async function handleDeposit(player: alt.Player, amount: number, callback?: (success: boolean) => void) {
    if (!callback) {
        console.error('Callback missing on deposit event');
        return;
    }
    
    if (amount <= 0) {
        callback(false);
        return;
    }
    
    const currentMoney = getPlayerMoney(player);
    
    if (currentMoney < amount) {
        callback(false);
        return;
    }
    
    // For now, just remove money (in a real scenario, you'd transfer to bank account)
    const success = await removePlayerMoney(player, amount);
    
    const rPlayer = Rebar.usePlayer(player);
    if (success) {
        rPlayer.notify.showNotification(`Dépôt de ${amount}€ effectué avec succès`);
    }
    
    callback(success);
}

// Handle withdraw
async function handleWithdraw(player: alt.Player, amount: number, callback?: (success: boolean) => void) {
    if (!callback) {
        console.error('Callback missing on withdraw event');
        return;
    }
    
    if (amount <= 0) {
        callback(false);
        return;
    }
    
    // For now, just add money (in a real scenario, you'd check bank balance)
    const success = await addPlayerMoney(player, amount);
    
    const rPlayer = Rebar.usePlayer(player);
    if (success) {
        rPlayer.notify.showNotification(`Retrait de ${amount}€ effectué avec succès`);
    } else {
        rPlayer.notify.showNotification(`Solde bancaire insuffisant`);
    }
    
    callback(success);
}

// Register /bank command
messenger.commands.register({
    name: 'bank',
    desc: '- Ouvrir le menu de la banque',
    callback: async (player) => {
        handleOpenBank(player);
    },
});

// Register events
alt.on('rebar:playerCharacterBound', initPlayerMoney);
alt.onClient(MoneyEvents.toServer.openBank, handleOpenBank);
alt.onClient(MoneyEvents.toServer.closeBank, handleCloseBank);
alt.onClient(MoneyEvents.toServer.deposit, handleDeposit);
alt.onClient(MoneyEvents.toServer.withdraw, handleWithdraw);

// Export API for other plugins
const API_NAME = 'money-api';

function useApi() {
    return {
        getPlayerMoney,
        setPlayerMoney,
        addPlayerMoney,
        removePlayerMoney,
        updatePlayerMoney,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof useApi>;
    }
}

Rebar.useApi().register(API_NAME, useApi());
