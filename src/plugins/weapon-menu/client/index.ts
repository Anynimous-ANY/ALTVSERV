import * as alt from 'alt-client';
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

// Handle key press for closing the menu
alt.on('keyup', (key: number) => {
    try {
        if (!webview) {
            return;
        }

        if (!webview.isPageOpen('WeaponMenu')) {
            return;
        }

        // Don't close if console is open
        if (alt.isConsoleOpen()) {
            return;
        }

        if (key === WeaponMenuConfig.keybinds.close) {
            webview.hide('WeaponMenu');
            webview.unfocus();
            alt.toggleGameControls(true);
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

        alt.emitServer(WeaponMenuEvents.toServer.giveWeapon, weaponHash, (success: boolean, error?: string) => {
            if (!success) {
                console.error('Failed to give weapon:', error);
            }
        });
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

        alt.emitServer(WeaponMenuEvents.toServer.toggleFavorite, weaponHash, (success: boolean, error?: string) => {
            if (!success) {
                console.error('Failed to toggle favorite:', error);
            }
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
});

// Handle get favorites from webview
webview.on(WeaponMenuEvents.toServer.getFavorites, () => {
    try {
        alt.emitServer(WeaponMenuEvents.toServer.getFavorites, (favorites: string[] | null) => {
            if (!favorites) {
                console.error('Failed to get favorites');
            }
        });
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
        webview.unfocus();
        alt.toggleGameControls(true);
    } catch (error) {
        console.error('Error closing menu:', error);
    }
});

// When the webview is shown, focus it and disable game controls
alt.on('rebar:pageShow', (pageName: string) => {
    try {
        if (pageName !== 'WeaponMenu') {
            return;
        }

        if (!webview) {
            return;
        }

        webview.focus();
        alt.toggleGameControls(false);
        webview.emit(WeaponMenuEvents.toWebview.open);
    } catch (error) {
        console.error('Error showing weapon menu:', error);
    }
});

// When the webview is hidden, unfocus it and enable game controls
alt.on('rebar:pageHide', (pageName: string) => {
    try {
        if (pageName !== 'WeaponMenu') {
            return;
        }

        if (!webview) {
            return;
        }

        webview.unfocus();
        alt.toggleGameControls(true);
        webview.emit(WeaponMenuEvents.toWebview.close);
    } catch (error) {
        console.error('Error hiding weapon menu:', error);
    }
});
