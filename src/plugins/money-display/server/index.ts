import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { MoneyEvents } from '../shared/events.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Key for storing money in character document
const MONEY_KEY = 'money';

// Initialize player money display
function initPlayerMoney(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        console.warn(`[Money Display] Character document not found for player ${player.name}`);
        return;
    }

    // Get current money or set to 0 if not exists
    const currentMoney = document[MONEY_KEY] ?? 0;
    
    // Initialize money in database if not set
    if (typeof document[MONEY_KEY] === 'undefined') {
        rPlayer.character.set(MONEY_KEY, 0).catch((err) => {
            console.error(`[Money Display] Failed to initialize money for player ${player.name}:`, err);
        });
    }
    
    // Show the money display overlay
    Rebar.player.useWebview(player).show('MoneyDisplay', 'overlay');
    
    // Send current money to webview
    updatePlayerMoney(player, currentMoney);
}

// Update player money in webview
function updatePlayerMoney(player: alt.Player, amount: number) {
    if (!player || !player.valid) {
        return;
    }
    
    // Ensure amount is a valid number
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    
    Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.updateMoney, validAmount);
}

// Get player money
function getPlayerMoney(player: alt.Player): number {
    if (!player || !player.valid) {
        return 0;
    }

    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        return 0;
    }
    
    const money = document[MONEY_KEY];
    return typeof money === 'number' && !isNaN(money) ? money : 0;
}

// Set player money
async function setPlayerMoney(player: alt.Player, amount: number): Promise<boolean> {
    if (!player || !player.valid) {
        return false;
    }

    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        console.warn(`[Money Display] Cannot set money: Character document not found for player ${player.name}`);
        return false;
    }
    
    // Ensure amount is not negative and is a valid number
    const newAmount = Math.max(0, typeof amount === 'number' && !isNaN(amount) ? amount : 0);
    
    try {
        // Update in database
        await rPlayer.character.set(MONEY_KEY, newAmount);
        
        // Update webview
        updatePlayerMoney(player, newAmount);
        
        return true;
    } catch (error) {
        console.error(`[Money Display] Failed to set money for player ${player.name}:`, error);
        return false;
    }
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
    if (!player || !player.valid) {
        return;
    }

    const rPlayer = Rebar.usePlayer(player);
    const document = rPlayer.character.get();
    
    if (!document) {
        rPlayer.notify.showNotification('Erreur: Personnage non chargé');
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
    if (!player || !player.valid) {
        return;
    }

    // Hide bank menu
    Rebar.player.useWebview(player).hide('BankMenu');
    
    // Enable game controls
    alt.emitClient(player, MoneyEvents.toClient.closeBankMenu);
}

// Handle deposit
async function handleDeposit(player: alt.Player, amount: number) {
    if (!player || !player.valid) {
        console.warn('[Money Display] Invalid player in handleDeposit');
        Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.depositResult, false, amount);
        return;
    }
    
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        console.warn('[Money Display] Invalid amount in handleDeposit:', amount);
        Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.depositResult, false, amount);
        return;
    }
    
    const currentMoney = getPlayerMoney(player);
    
    if (currentMoney < amount) {
        Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.depositResult, false, amount);
        return;
    }
    
    // TODO: Implement separate bank account system
    // For now, just remove money from player (simulating deposit to bank)
    const success = await removePlayerMoney(player, amount);
    
    const rPlayer = Rebar.usePlayer(player);
    if (success) {
        rPlayer.notify.showNotification(`Dépôt de ${amount}€ effectué avec succès`);
    }
    
    // Emit result back to webview
    Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.depositResult, success, amount);
}

// Handle withdraw
async function handleWithdraw(player: alt.Player, amount: number) {
    if (!player || !player.valid) {
        console.warn('[Money Display] Invalid player in handleWithdraw');
        Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.withdrawResult, false, amount);
        return;
    }
    
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        console.warn('[Money Display] Invalid amount in handleWithdraw:', amount);
        Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.withdrawResult, false, amount);
        return;
    }
    
    // TODO: Implement bank balance checking
    // For now, just add money (simulating withdrawal from bank with unlimited balance)
    const success = await addPlayerMoney(player, amount);
    
    const rPlayer = Rebar.usePlayer(player);
    if (success) {
        rPlayer.notify.showNotification(`Retrait de ${amount}€ effectué avec succès`);
    } else {
        rPlayer.notify.showNotification(`Solde bancaire insuffisant`);
    }
    
    // Emit result back to webview
    Rebar.player.useWebview(player).emit(MoneyEvents.toWebview.withdrawResult, success, amount);
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
