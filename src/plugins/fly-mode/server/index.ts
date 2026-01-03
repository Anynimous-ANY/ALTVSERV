import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { FlyModeEvents } from '../shared/events.js';
import { useEntityPermissions } from '@Server/systems/permissions/entityPermissions.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Track fly mode state per player
const flyModeStates = new Map<number, boolean>();

/**
 * Get current fly mode state for a player
 */
function getFlyModeState(playerId: number): boolean {
    return flyModeStates.get(playerId) || false;
}

/**
 * Toggle fly mode for a player
 */
function toggleFlyMode(player: alt.Player): void {
    const currentState = getFlyModeState(player.id);
    const newState = !currentState;
    flyModeStates.set(player.id, newState);

    // Emit to client to handle fly mode
    alt.emitClient(player, FlyModeEvents.toClient.setFlyMode, newState);

    // Notify player
    const rPlayer = Rebar.usePlayer(player);
    const statusText = newState ? 'enabled' : 'disabled';
    rPlayer.notify.showNotification(`Fly mode ${statusText}`);
}

// Register /fly command
messenger.commands.register({
    name: 'fly',
    desc: '- Toggle fly mode (noclip)',
    options: { permissions: ['admin'] },
    callback: async (player: alt.Player) => {
        if (!player || !player.valid) {
            return;
        }

        try {
            toggleFlyMode(player);
        } catch (error) {
            console.error('[Fly Mode] Error toggling fly mode:', error);
        }
    },
});

// Handle fly mode toggle from client (F10 key)
alt.onClient(FlyModeEvents.toServer.toggleFly, (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        // Check if player has admin permission
        const hasPermission = useEntityPermissions({ permissions: ['admin'] }).check(player);
        
        if (!hasPermission) {
            const rPlayer = Rebar.usePlayer(player);
            rPlayer.notify.showNotification('You do not have permission to use fly mode');
            return;
        }

        toggleFlyMode(player);
    } catch (error) {
        console.error('[Fly Mode] Error toggling fly mode from client:', error);
    }
});

// Handle speed update from client
alt.onClient(FlyModeEvents.toServer.updateSpeed, (player: alt.Player, speed: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        const rPlayer = Rebar.usePlayer(player);
        rPlayer.notify.showNotification(`Fly speed: ${speed.toFixed(1)}x`);
    } catch (error) {
        console.error('[Fly Mode] Error updating speed:', error);
    }
});

// Clean up when player disconnects
alt.on('playerDisconnect', (player: alt.Player) => {
    flyModeStates.delete(player.id);
});
