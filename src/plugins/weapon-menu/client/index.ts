import * as alt from 'alt-client';
import * as native from 'natives';
import { useRebarClient } from '../../../main/client/index.js';
import { WeaponMenuConfig } from '../shared/config.js';
import { WeaponMenuEvents } from '../shared/events.js';
import { WEAPONS } from '../shared/weapons.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();

// Track if input is focused (typing in search bar)
let isInputFocused = false;

// Validate weapon hash
function isValidWeaponHash(hash: string): boolean {
    if (!hash || typeof hash !== 'string') {
        return false;
    }
    return WEAPONS.some((weapon) => weapon.hash === hash);
}

// Listen for input focus events from webview
webview.on('weaponmenu:inputFocused', () => {
    isInputFocused = true;
});

webview.on('weaponmenu:inputBlurred', () => {
    isInputFocused = false;
});

// Tick function to disable controls every frame while menu is open
// This runs every frame and checks if the menu is open
alt.everyTick(() => {
    // Only disable controls if the WeaponMenu page is specifically open
    if (!webview.isSpecificPageOpen('WeaponMenu')) {
        return;
    }

    // Disable specific controls but allow movement and vehicle controls (unless typing)
    // Disable attack controls
    native.disableControlAction(0, 24, true); // INPUT_ATTACK
    native.disableControlAction(0, 25, true); // INPUT_AIM
    native.disableControlAction(0, 37, true); // INPUT_SELECT_WEAPON
    native.disableControlAction(0, 140, true); // INPUT_MELEE_ATTACK_LIGHT
    native.disableControlAction(0, 141, true); // INPUT_MELEE_ATTACK_HEAVY
    native.disableControlAction(0, 142, true); // INPUT_MELEE_ATTACK_ALTERNATE
    native.disableControlAction(0, 257, true); // INPUT_ATTACK2
    native.disableControlAction(0, 263, true); // INPUT_MELEE_ATTACK1
    native.disableControlAction(0, 264, true); // INPUT_MELEE_ATTACK2
    
    // Disable phone and radio wheel
    native.disableControlAction(0, 27, true); // INPUT_PHONE
    native.disableControlAction(0, 19, true); // INPUT_CHARACTER_WHEEL
    
    // Disable pause menu and camera view changes
    native.disableControlAction(0, 199, true); // INPUT_FRONTEND_PAUSE (P key - pause menu)
    native.disableControlAction(0, 0, true); // INPUT_NEXT_CAMERA (V key - camera view)
    
    // Disable weapon wheel
    native.disableControlAction(0, 14, true); // INPUT_SELECT_NEXT_WEAPON
    native.disableControlAction(0, 15, true); // INPUT_SELECT_PREV_WEAPON
    
    // Disable other menu-related controls
    native.disableControlAction(0, 56, true); // INPUT_SPRINT
    
    // Disable vehicle radio/music controls
    native.disableControlAction(0, 85, true); // INPUT_VEH_RADIO_WHEEL
    native.disableControlAction(0, 82, true); // INPUT_VEH_NEXT_RADIO
    native.disableControlAction(0, 83, true); // INPUT_VEH_PREV_RADIO
    native.disableControlAction(0, 84, true); // INPUT_VEH_NEXT_RADIO_TRACK
    native.disableControlAction(0, 19, true); // INPUT_CHARACTER_WHEEL (also disables vehicle wheel)
    
    // Lock camera rotation (prevent right-click camera movement)
    native.disableControlAction(0, 1, true); // INPUT_LOOK_LR (Look Left/Right)
    native.disableControlAction(0, 2, true); // INPUT_LOOK_UD (Look Up/Down)
    native.disableControlAction(0, 3, true); // INPUT_LOOK_UP_ONLY
    native.disableControlAction(0, 4, true); // INPUT_LOOK_DOWN_ONLY
    native.disableControlAction(0, 5, true); // INPUT_LOOK_LEFT_ONLY
    native.disableControlAction(0, 6, true); // INPUT_LOOK_RIGHT_ONLY
    
    // If input is focused (typing), disable ALL movement and vehicle controls
    if (isInputFocused) {
        // Disable walking/running
        native.disableControlAction(0, 30, true); // INPUT_MOVE_LR
        native.disableControlAction(0, 31, true); // INPUT_MOVE_UD
        native.disableControlAction(0, 32, true); // INPUT_MOVE_UP_ONLY
        native.disableControlAction(0, 33, true); // INPUT_MOVE_DOWN_ONLY
        native.disableControlAction(0, 34, true); // INPUT_MOVE_LEFT_ONLY
        native.disableControlAction(0, 35, true); // INPUT_MOVE_RIGHT_ONLY
        native.disableControlAction(0, 21, true); // INPUT_SPRINT
        native.disableControlAction(0, 22, true); // INPUT_JUMP
        
        // Disable vehicle controls
        native.disableControlAction(0, 59, true); // INPUT_VEH_MOVE_LR
        native.disableControlAction(0, 60, true); // INPUT_VEH_MOVE_UD
        native.disableControlAction(0, 71, true); // INPUT_VEH_ACCELERATE
        native.disableControlAction(0, 72, true); // INPUT_VEH_BRAKE
        native.disableControlAction(0, 63, true); // INPUT_VEH_STEER_LEFT
        native.disableControlAction(0, 64, true); // INPUT_VEH_STEER_RIGHT
        native.disableControlAction(0, 76, true); // INPUT_VEH_HANDBRAKE
    }
    
    // If not typing, allow movement controls explicitly:
    // INPUT_MOVE_LR (30), INPUT_MOVE_UD (31) - walking/running
    // INPUT_MOVE_UP_ONLY (32), INPUT_MOVE_DOWN_ONLY (33)
    // INPUT_MOVE_LEFT_ONLY (34), INPUT_MOVE_RIGHT_ONLY (35)
    
    // Allow vehicle controls when not typing:
    // INPUT_VEH_MOVE_LR (59), INPUT_VEH_MOVE_UD (60)
    // INPUT_VEH_ACCELERATE (71), INPUT_VEH_BRAKE (72)
    // INPUT_VEH_STEER_LEFT (63), INPUT_VEH_STEER_RIGHT (64)
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
