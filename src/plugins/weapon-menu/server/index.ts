import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WeaponMenuEvents } from '../shared/events.js';
import { WEAPONS } from '../shared/weapons.js';
import './api.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Validate weapon hash against known weapons
function isValidWeaponHash(hash: string): boolean {
    return WEAPONS.some((weapon) => weapon.hash === hash);
}

// Get weapon name from hash
function getWeaponName(hash: string): string {
    const weapon = WEAPONS.find((w) => w.hash === hash);
    return weapon ? weapon.name : hash;
}

// Register the /weapons command
messenger.commands.register({
    name: 'weapons',
    desc: '- Opens the weapon menu',
    callback: async (player: alt.Player) => {
        if (!player || !player.valid) {
            return;
        }

        try {
            const rPlayer = Rebar.usePlayer(player);
            const character = rPlayer.character.get();

            if (!character) {
                rPlayer.notify.showNotification('You must have a character selected.');
                return;
            }

            const webview = Rebar.player.useWebview(player);
            webview.show('WeaponMenu', 'page');
        } catch (error) {
            console.error('Error opening weapon menu:', error);
        }
    },
});

// Handle weapon give request
alt.onClient(WeaponMenuEvents.toServer.giveWeapon, (player: alt.Player, weaponHash: string, callback?: (success: boolean, error?: string) => void) => {
    if (!player || !player.valid) {
        if (callback) callback(false, 'Invalid player');
        return;
    }

    try {
        // Validate weapon hash
        if (!weaponHash || typeof weaponHash !== 'string') {
            if (callback) callback(false, 'Invalid weapon hash');
            return;
        }

        if (!isValidWeaponHash(weaponHash)) {
            if (callback) callback(false, 'Unknown weapon');
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            if (callback) callback(false, 'No character selected');
            return;
        }

        // Get weapon data for ammo
        const weaponData = WEAPONS.find((w) => w.hash === weaponHash);
        const ammo = weaponData?.ammo ?? 999;

        // Give weapon to player with appropriate ammo
        player.giveWeapon(alt.hash(weaponHash), ammo, true);

        const weaponName = getWeaponName(weaponHash);
        rPlayer.notify.showNotification(`${weaponName} received!`);

        if (callback) callback(true);
    } catch (error) {
        console.error('Error giving weapon:', error);
        if (callback) callback(false, 'Server error');
    }
});

// Handle favorite toggle
alt.onClient(WeaponMenuEvents.toServer.toggleFavorite, async (player: alt.Player, weaponHash: string, callback?: (success: boolean, error?: string) => void) => {
    if (!player || !player.valid) {
        if (callback) callback(false, 'Invalid player');
        return;
    }

    try {
        // Validate weapon hash
        if (!weaponHash || typeof weaponHash !== 'string') {
            if (callback) callback(false, 'Invalid weapon hash');
            return;
        }

        if (!isValidWeaponHash(weaponHash)) {
            if (callback) callback(false, 'Unknown weapon');
            return;
        }

        const document = Rebar.document.character.useCharacter(player);
        const data = document.get();

        if (!data) {
            if (callback) callback(false, 'No character data');
            return;
        }

        // Initialize favorites if not exists
        let favorites: string[] = (data.favoriteWeapons as string[]) || [];

        // Toggle favorite
        const index = favorites.indexOf(weaponHash);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            // Limit favorites to 20 weapons
            if (favorites.length >= 20) {
                const rPlayer = Rebar.usePlayer(player);
                rPlayer.notify.showNotification('Maximum 20 favorite weapons allowed');
                if (callback) callback(false, 'Max favorites reached');
                return;
            }
            favorites.push(weaponHash);
        }

        // Save to character document
        const success = await document.setBulk({ favoriteWeapons: favorites });

        if (!success) {
            if (callback) callback(false, 'Failed to save favorites');
            return;
        }

        // Send updated favorites to webview
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);

        if (callback) callback(true);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        if (callback) callback(false, 'Server error');
    }
});

// Handle get favorites request
alt.onClient(WeaponMenuEvents.toServer.getFavorites, (player: alt.Player, callback?: (favorites: string[] | null) => void) => {
    if (!player || !player.valid) {
        if (callback) callback(null);
        return;
    }

    try {
        const document = Rebar.document.character.useCharacter(player);
        const data = document.get();

        if (!data) {
            if (callback) callback(null);
            return;
        }

        const favorites: string[] = (data.favoriteWeapons as string[]) || [];
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);

        if (callback) callback(favorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
        if (callback) callback(null);
    }
});
