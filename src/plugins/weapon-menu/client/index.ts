import * as alt from 'alt-client';
import * as native from 'natives';
import { useRebarClient } from '../../../main/client/index.js';
import { WeaponMenuConfig } from '../shared/config.js';
import { WeaponMenuEvents } from '../shared/events.js';
import { WEAPONS } from '../shared/weapons.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();

// Validate weapon hash
function isValidWeaponHash(hash: string): boolean {
    if (!hash || typeof hash !== 'string') {
        return false;
    }
    return WEAPONS.some((weapon) => weapon.hash === hash);
}

// Tick function to disable controls every frame while menu is open
// This runs every frame and checks if the menu is open
alt.everyTick(() => {
    // Only disable controls if the WeaponMenu page is specifically open
    if (!webview.isSpecificPageOpen('WeaponMenu')) {
        return;
    }

    // Disable camera movement
    native.disableControlAction(0, 1, true); // LookLeftRight
    native.disableControlAction(0, 2, true); // LookUpDown
    native.disableControlAction(0, 3, true); // LookUpOnly
    native.disableControlAction(0, 4, true); // LookDownOnly
    native.disableControlAction(0, 5, true); // LookLeft
    native.disableControlAction(0, 6, true); // LookRight

    // Disable attack controls
    native.disableControlAction(0, 24, true); // Attack
    native.disableControlAction(0, 25, true); // Aim
    native.disableControlAction(0, 140, true); // Melee Attack Light
    native.disableControlAction(0, 141, true); // Melee Attack Heavy
    native.disableControlAction(0, 142, true); // Melee Attack Alternate

    // Disable weapon wheel
    native.disableControlAction(0, 14, true); // Weapon Wheel Up
    native.disableControlAction(0, 15, true); // Weapon Wheel Down
    native.disableControlAction(0, 16, true); // Weapon Wheel Left
    native.disableControlAction(0, 17, true); // Weapon Wheel Right
});

// Handle key press for closing the menu
alt.on('keyup', (key: number) => {
    try {
        if (!webview) {
            return;
        }

        if (!webview.isSpecificPageOpen('WeaponMenu')) {
            return;
        }

        // Don't close if console is open
        if (alt.isConsoleOpen()) {
            return;
        }

        if (key === WeaponMenuConfig.keybinds.close) {
            webview.hide('WeaponMenu');
        }
    } catch (error) {
        console.error('Error handling keyup:', error);
    }
});

// Handle weapon selection from webview
webview.on(WeaponMenuEvents.toServer.giveWeapon, (weaponHash: string) => {
    try {
        if (!isValidWeaponHash(weaponHash)) {
            console.error('Invalid weapon hash:', weaponHash);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.giveWeapon, weaponHash);
    } catch (error) {
        console.error('Error requesting weapon:', error);
    }
});

// Handle favorite toggle from webview
webview.on(WeaponMenuEvents.toServer.toggleFavorite, (weaponHash: string) => {
    try {
        if (!isValidWeaponHash(weaponHash)) {
            console.error('Invalid weapon hash:', weaponHash);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.toggleFavorite, weaponHash);
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
});

// Handle get favorites from webview
webview.on(WeaponMenuEvents.toServer.getFavorites, () => {
    try {
        alt.emitServer(WeaponMenuEvents.toServer.getFavorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
    }
});

// Handle close request from webview
webview.on('weaponmenu:client:requestClose', () => {
    try {
        if (!webview) {
            return;
        }

        webview.hide('WeaponMenu');
    } catch (error) {
        console.error('Error closing menu:', error);
    }
});
