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
alt.onClient(WeaponMenuEvents.toServer.giveWeapon, (player: alt.Player, weaponHash: string) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        // Validate weapon hash
        if (!weaponHash || typeof weaponHash !== 'string') {
            return;
        }

        if (!isValidWeaponHash(weaponHash)) {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        // Get weapon data for ammo
        const weaponData = WEAPONS.find((w) => w.hash === weaponHash);
        const ammo = weaponData?.ammo ?? 999;

        // Give weapon to player with appropriate ammo
        player.giveWeapon(alt.hash(weaponHash), ammo, true);

        const weaponName = getWeaponName(weaponHash);
        rPlayer.notify.showNotification(`${weaponName} received!`);
    } catch (error) {
        console.error('Error giving weapon:', error);
    }
});

// Handle favorite toggle
alt.onClient(WeaponMenuEvents.toServer.toggleFavorite, async (player: alt.Player, weaponHash: string) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        // Validate weapon hash
        if (!weaponHash || typeof weaponHash !== 'string') {
            return;
        }

        if (!isValidWeaponHash(weaponHash)) {
            return;
        }

        const document = Rebar.document.character.useCharacter(player);
        const data = document.get();

        if (!data) {
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
                return;
            }
            favorites.push(weaponHash);
        }

        // Save to character document
        const success = await document.setBulk({ favoriteWeapons: favorites });

        if (!success) {
            return;
        }

        // Send updated favorites to webview
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
});

// Handle get favorites request
alt.onClient(WeaponMenuEvents.toServer.getFavorites, (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        const document = Rebar.document.character.useCharacter(player);
        const data = document.get();

        if (!data) {
            return;
        }

        const favorites: string[] = (data.favoriteWeapons as string[]) || [];
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setFavorites, favorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
    }
});

// Handle get current weapons request
alt.onClient(WeaponMenuEvents.toServer.getCurrentWeapons, (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        // Get all weapons the player currently has
        const allWeapons: any[] = [];
        
        // Iterate through all known weapons and check if player has them
        for (const weaponDef of WEAPONS) {
            const weaponHash = alt.hash(weaponDef.hash);
            if (player.hasWeapon(weaponHash)) {
                const ammo = player.getWeaponAmmo(weaponHash);
                const tintIndex = player.getWeaponTintIndex(weaponHash);
                const components = player.getWeaponComponents(weaponHash);
                
                allWeapons.push({
                    hash: weaponHash,
                    name: weaponDef.name,
                    ammo: ammo,
                    tintIndex: tintIndex,
                    components: components || [],
                });
            }
        }

        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error getting current weapons:', error);
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, []);
    }
});

// Handle remove weapon request
alt.onClient(WeaponMenuEvents.toServer.removeWeapon, async (player: alt.Player, weaponHash: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        // Remove the weapon from player
        player.removeWeapon(weaponHash);

        rPlayer.notify.showNotification('Weapon removed');

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weaponDef of WEAPONS) {
            const wHash = alt.hash(weaponDef.hash);
            if (player.hasWeapon(wHash)) {
                const ammo = player.getWeaponAmmo(wHash);
                const tintIndex = player.getWeaponTintIndex(wHash);
                const components = player.getWeaponComponents(wHash);
                
                allWeapons.push({
                    hash: wHash,
                    name: weaponDef.name,
                    ammo: ammo,
                    tintIndex: tintIndex,
                    components: components || [],
                });
            }
        }
        
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error removing weapon:', error);
    }
});

// Handle set weapon tint request
alt.onClient(WeaponMenuEvents.toServer.setWeaponTint, async (player: alt.Player, weaponHash: number, tintIndex: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof tintIndex !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        // Check if player has the weapon
        if (!player.hasWeapon(weaponHash)) {
            return;
        }

        // Set the weapon tint
        player.setWeaponTintIndex(weaponHash, tintIndex);

        rPlayer.notify.showNotification('Weapon tint changed');

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weaponDef of WEAPONS) {
            const wHash = alt.hash(weaponDef.hash);
            if (player.hasWeapon(wHash)) {
                const ammo = player.getWeaponAmmo(wHash);
                const tintIdx = player.getWeaponTintIndex(wHash);
                const components = player.getWeaponComponents(wHash);
                
                allWeapons.push({
                    hash: wHash,
                    name: weaponDef.name,
                    ammo: ammo,
                    tintIndex: tintIdx,
                    components: components || [],
                });
            }
        }
        
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error setting weapon tint:', error);
    }
});

// Handle set weapon ammo request
alt.onClient(WeaponMenuEvents.toServer.setWeaponAmmo, async (player: alt.Player, weaponHash: number, ammo: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof ammo !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        // Check if player has the weapon
        if (!player.hasWeapon(weaponHash)) {
            return;
        }

        // Clamp ammo between 0 and 9999
        const clampedAmmo = Math.max(0, Math.min(9999, ammo));
        
        // Set the weapon ammo
        player.setWeaponAmmo(weaponHash, clampedAmmo);

        rPlayer.notify.showNotification(`Weapon ammo set to ${clampedAmmo}`);

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weaponDef of WEAPONS) {
            const wHash = alt.hash(weaponDef.hash);
            if (player.hasWeapon(wHash)) {
                const weaponAmmo = player.getWeaponAmmo(wHash);
                const tintIndex = player.getWeaponTintIndex(wHash);
                const components = player.getWeaponComponents(wHash);
                
                allWeapons.push({
                    hash: wHash,
                    name: weaponDef.name,
                    ammo: weaponAmmo,
                    tintIndex: tintIndex,
                    components: components || [],
                });
            }
        }
        
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error setting weapon ammo:', error);
    }
});

// Handle add weapon component request
alt.onClient(WeaponMenuEvents.toServer.addWeaponComponent, async (player: alt.Player, weaponHash: number, component: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof component !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        const weapon = Rebar.player.useWeapon(player);
        await weapon.addWeaponComponent(weaponHash, component);

        rPlayer.notify.showNotification('Component added');

        // Send updated weapons list
        const currentWeapons = weapon.getWeapons();
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, currentWeapons);
    } catch (error) {
        console.error('Error adding weapon component:', error);
    }
});

// Handle remove weapon component request
alt.onClient(WeaponMenuEvents.toServer.removeWeaponComponent, async (player: alt.Player, weaponHash: number, component: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof component !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        const weapon = Rebar.player.useWeapon(player);
        await weapon.removeWeaponComponent(weaponHash, component);

        rPlayer.notify.showNotification('Component removed');

        // Send updated weapons list
        const currentWeapons = weapon.getWeapons();
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, currentWeapons);
    } catch (error) {
        console.error('Error removing weapon component:', error);
    }
});
