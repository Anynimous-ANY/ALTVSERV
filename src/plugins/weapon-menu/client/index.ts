import * as alt from 'alt-client';
import { useRebarClient } from '../../../main/client/index.js';
import { WeaponMenuConfig } from '../shared/config.js';
import { WeaponMenuEvents } from '../shared/events.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();

// Handle key press for closing the menu
alt.on('keyup', (key: number) => {
    if (!webview.isPageOpen('WeaponMenu')) {
        return;
    }

    if (key === WeaponMenuConfig.keybinds.close) {
        webview.hide('WeaponMenu');
        webview.unfocus();
        alt.toggleGameControls(true);
    }
});

// Handle weapon selection from webview
webview.on(WeaponMenuEvents.toServer.giveWeapon, (weaponHash: string) => {
    alt.emitServer(WeaponMenuEvents.toServer.giveWeapon, weaponHash);
});

// Handle favorite toggle from webview
webview.on(WeaponMenuEvents.toServer.toggleFavorite, (weaponHash: string) => {
    alt.emitServer(WeaponMenuEvents.toServer.toggleFavorite, weaponHash);
});

// Handle get favorites from webview
webview.on(WeaponMenuEvents.toServer.getFavorites, () => {
    alt.emitServer(WeaponMenuEvents.toServer.getFavorites);
});

// When the webview is shown, focus it and disable game controls
alt.on('rebar:pageShow', (pageName: string) => {
    if (pageName !== 'WeaponMenu') {
        return;
    }

    webview.focus();
    alt.toggleGameControls(false);
    webview.emit(WeaponMenuEvents.toWebview.open);
});

// When the webview is hidden, unfocus it and enable game controls
alt.on('rebar:pageHide', (pageName: string) => {
    if (pageName !== 'WeaponMenu') {
        return;
    }

    webview.unfocus();
    alt.toggleGameControls(true);
    webview.emit(WeaponMenuEvents.toWebview.close);
});
