import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WeaponMenuEvents } from '../shared/events.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Register the /weapons command
messenger.commands.register({
    name: 'weapons',
    desc: '- Opens the weapon menu',
    callback: async (player: alt.Player) => {
        const webview = Rebar.player.useWebview(player);
        webview.show('WeaponMenu', 'page');
    },
});

// Handle weapon give request
alt.onClient(WeaponMenuEvents.toServer.giveWeapon, (player: alt.Player, weaponHash: string) => {
    if (!player || !player.valid) {
        return;
    }

    // Give weapon to player with full ammo
    player.giveWeapon(alt.hash(weaponHash), 999, true);
    
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification(`Weapon ${weaponHash} received!`);
});

// Handle favorite toggle
alt.onClient(WeaponMenuEvents.toServer.toggleFavorite, async (player: alt.Player, weaponHash: string) => {
    if (!player || !player.valid) {
        return;
    }

    const document = Rebar.document.character.useCharacter(player);
    const data = document.get();

    if (!data) {
        return;
    }

    // Initialize favorites if not exists
    let favorites: string[] = data.favoriteWeapons || [];

    // Toggle favorite
    const index = favorites.indexOf(weaponHash);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(weaponHash);
    }

    // Save to character document
    await document.setBulk({ favoriteWeapons: favorites });

    // Send updated favorites to webview
    const webview = Rebar.player.useWebview(player);
    webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);
});

// Handle get favorites request
alt.onClient(WeaponMenuEvents.toServer.getFavorites, (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    const document = Rebar.document.character.useCharacter(player);
    const data = document.get();

    if (!data) {
        return;
    }

    const favorites: string[] = data.favoriteWeapons || [];
    const webview = Rebar.player.useWebview(player);
    webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);
});
