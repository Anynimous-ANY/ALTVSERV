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

    // Disable ALL control actions to prevent any GTA controls from triggering
    // This includes camera, movement, attacks, menus, vehicle controls, etc.
    // Using disableAllControlActions is more comprehensive than listing individual controls
    native.disableAllControlActions(0);
    
    // Also disable control group 1 and 2 for additional coverage
    native.disableAllControlActions(1);
    native.disableAllControlActions(2);
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
            webview.hide("WeaponMenu");
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

// Handle get current weapons from webview
webview.on(WeaponMenuEvents.toServer.getCurrentWeapons, () => {
    try {
        alt.emitServer(WeaponMenuEvents.toServer.getCurrentWeapons);
    } catch (error) {
        console.error('Error getting current weapons:', error);
    }
});

// Handle remove weapon from webview
webview.on(WeaponMenuEvents.toServer.removeWeapon, (weaponHash: number) => {
    try {
        if (!weaponHash || typeof weaponHash !== 'number') {
            console.error('Invalid weapon hash:', weaponHash);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.removeWeapon, weaponHash);
    } catch (error) {
        console.error('Error removing weapon:', error);
    }
});

// Handle set weapon tint from webview
webview.on(WeaponMenuEvents.toServer.setWeaponTint, (weaponHash: number, tintIndex: number) => {
    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof tintIndex !== 'number') {
            console.error('Invalid parameters:', weaponHash, tintIndex);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.setWeaponTint, weaponHash, tintIndex);
    } catch (error) {
        console.error('Error setting weapon tint:', error);
    }
});

// Handle set weapon ammo from webview
webview.on(WeaponMenuEvents.toServer.setWeaponAmmo, (weaponHash: number, ammo: number) => {
    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof ammo !== 'number') {
            console.error('Invalid parameters:', weaponHash, ammo);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.setWeaponAmmo, weaponHash, ammo);
    } catch (error) {
        console.error('Error setting weapon ammo:', error);
    }
});

// Handle add weapon component from webview
webview.on(WeaponMenuEvents.toServer.addWeaponComponent, (weaponHash: number, component: number) => {
    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof component !== 'number') {
            console.error('Invalid parameters:', weaponHash, component);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.addWeaponComponent, weaponHash, component);
    } catch (error) {
        console.error('Error adding weapon component:', error);
    }
});

// Handle remove weapon component from webview
webview.on(WeaponMenuEvents.toServer.removeWeaponComponent, (weaponHash: number, component: number) => {
    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof component !== 'number') {
            console.error('Invalid parameters:', weaponHash, component);
            return;
        }

        alt.emitServer(WeaponMenuEvents.toServer.removeWeaponComponent, weaponHash, component);
    } catch (error) {
        console.error('Error removing weapon component:', error);
    }
});
