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

        // Get weapon data for ammo and price
        const weaponData = WEAPONS.find((w) => w.hash === weaponHash);
        if (!weaponData) {
            return;
        }

        const ammo = weaponData.ammo ?? 999;
        const price = weaponData.price ?? 0;
        const weaponName = getWeaponName(weaponHash);

        // Check if weapon costs money
        if (price > 0) {
            // Get money API
            const moneyApi = Rebar.useApi().get('money-api');
            if (!moneyApi) {
                rPlayer.notify.showNotification('Money system not available');
                return;
            }

            // Check player money
            const playerMoney = moneyApi.getPlayerMoney(player);
            if (playerMoney < price) {
                rPlayer.notify.showNotification(`Insufficient funds! Need ${price}€, you have ${playerMoney}€`);
                return;
            }

            // Deduct money
            moneyApi.removePlayerMoney(player, price)
                .then((success: boolean) => {
                    if (!success) {
                        rPlayer.notify.showNotification(`Failed to process payment for ${weaponName} (${price}€)`);
                        return;
                    }

                    // Give weapon to player with appropriate ammo
                    player.giveWeapon(alt.hash(weaponHash), ammo, true);
                    rPlayer.notify.showNotification(`${weaponName} purchased for ${price}€!`);
                    
                    // Notify webview that weapon was given
                    const webview = Rebar.player.useWebview(player);
                    webview.emit(WeaponMenuEvents.toWebview.weaponGiven, weaponHash);
                })
                .catch((error: any) => {
                    console.error('Error processing payment:', error);
                    rPlayer.notify.showNotification('Payment processing failed. Please try again or contact support if the issue persists.');
                });
        } else {
            // Free weapon
            player.giveWeapon(alt.hash(weaponHash), ammo, true);
            rPlayer.notify.showNotification(`${weaponName} received!`);
            
            // Notify webview that weapon was given
            const webview = Rebar.player.useWebview(player);
            webview.emit(WeaponMenuEvents.toWebview.weaponGiven, weaponHash);
        }
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
        
        console.log('[WeaponMenu] Getting current weapons for player:', player.name);
        console.log('[WeaponMenu] player.weapons:', player.weapons);
        
        // player.weapons already contains all weapon data: { hash, tintIndex, components }
        if (player.weapons && Array.isArray(player.weapons)) {
            for (const weapon of player.weapons) {
                // Find matching weapon definition
                const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
                
                if (weaponDef) {
                    // Get ammo using the weapon hash
                    const ammo = player.getWeaponAmmo(weapon.hash);
                    
                    console.log('[WeaponMenu] Found weapon:', weaponDef.name, 'tint:', weapon.tintIndex, 'ammo:', ammo);
                    
                    allWeapons.push({
                        hash: weaponDef.hash, // Use string hash from weaponDef, not numeric hash from player.weapons
                        name: weaponDef.name,
                        image: weaponDef.image, // Include image property
                        ammo: ammo,
                        tintIndex: weapon.tintIndex,
                        components: weapon.components || [],
                    });
                } else {
                    console.log('[WeaponMenu] Unknown weapon hash:', weapon.hash);
                }
            }
        }

        console.log('[WeaponMenu] Sending', allWeapons.length, 'weapons to client');
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

        // Send updated weapons list using player.weapons array
        const allWeapons: any[] = [];
        if (player.weapons && Array.isArray(player.weapons)) {
            for (const weapon of player.weapons) {
                const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
                
                if (weaponDef) {
                    const ammo = player.getWeaponAmmo(weapon.hash);
                    
                    allWeapons.push({
                        hash: weapon.hash,
                        name: weaponDef.name,
                        ammo: ammo,
                        tintIndex: weapon.tintIndex,
                        components: weapon.components || [],
                    });
                }
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

        // Send updated weapons list using player.weapons array
        const allWeapons: any[] = [];
        if (player.weapons && Array.isArray(player.weapons)) {
            for (const weapon of player.weapons) {
                const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
                
                if (weaponDef) {
                    const ammo = player.getWeaponAmmo(weapon.hash);
                    
                    allWeapons.push({
                        hash: weapon.hash,
                        name: weaponDef.name,
                        ammo: ammo,
                        tintIndex: weapon.tintIndex,
                        components: weapon.components || [],
                    });
                }
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

        // Send updated weapons list using player.weapons array
        const allWeapons: any[] = [];
        if (player.weapons && Array.isArray(player.weapons)) {
            for (const weapon of player.weapons) {
                const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
                
                if (weaponDef) {
                    const weaponAmmo = player.getWeaponAmmo(weapon.hash);
                    
                    allWeapons.push({
                        hash: weapon.hash,
                        name: weaponDef.name,
                        ammo: weaponAmmo,
                        tintIndex: weapon.tintIndex,
                        components: weapon.components || [],
                    });
                }
            }
        }
        
        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error setting weapon ammo:', error);
    }
});

// Handle add weapon component request
alt.onClient(WeaponMenuEvents.toServer.addWeaponComponent, async (player: alt.Player, weaponHash: number, componentHash: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof componentHash !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        console.log(`[WeaponMenu] Adding component ${componentHash} to weapon ${weaponHash}`);
        
        // Check if player has the weapon
        if (!player.hasWeapon(weaponHash)) {
            console.log(`[WeaponMenu] ERROR: Player does not have weapon ${weaponHash}`);
            return;
        }

        // Simply add the component using native method
        // The game engine handles all visual updates and persistence
        player.addWeaponComponent(weaponHash, componentHash);
        console.log(`[WeaponMenu] Component ${componentHash} added to weapon ${weaponHash}`);

        rPlayer.notify.showNotification('Component added');

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weapon of player.weapons) {
            // Find the weapon definition to get the name
            let weaponName = `Weapon ${weapon.hash}`;
            for (const weaponDef of WEAPONS) {
                const wHash = alt.hash(weaponDef.hash);
                if (wHash === weapon.hash) {
                    weaponName = weaponDef.name;
                    break;
                }
            }

            allWeapons.push({
                hash: weapon.hash,
                name: weaponName,
                ammo: player.getWeaponAmmo(weapon.hash),
                tintIndex: weapon.tintIndex,
                components: weapon.components || [],
            });
        }

        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error adding weapon component:', error);
    }
});

// Handle remove weapon component request
alt.onClient(WeaponMenuEvents.toServer.removeWeaponComponent, async (player: alt.Player, weaponHash: number, componentHash: number) => {
    if (!player || !player.valid) {
        return;
    }

    try {
        if (!weaponHash || typeof weaponHash !== 'number' || typeof componentHash !== 'number') {
            return;
        }

        const rPlayer = Rebar.usePlayer(player);
        const character = rPlayer.character.get();

        if (!character) {
            return;
        }

        console.log(`[WeaponMenu] Removing component ${componentHash} from weapon ${weaponHash}`);
        
        // Check if player has the weapon
        if (!player.hasWeapon(weaponHash)) {
            console.log(`[WeaponMenu] ERROR: Player does not have weapon ${weaponHash}`);
            return;
        }

        // Simply remove the component using native method
        // The game engine handles all visual updates and persistence
        player.removeWeaponComponent(weaponHash, componentHash);
        console.log(`[WeaponMenu] Component ${componentHash} removed from weapon ${weaponHash}`);

        rPlayer.notify.showNotification('Component removed');

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weapon of player.weapons) {
            // Find the weapon definition to get the name
            let weaponName = `Weapon ${weapon.hash}`;
            for (const weaponDef of WEAPONS) {
                const wHash = alt.hash(weaponDef.hash);
                if (wHash === weapon.hash) {
                    weaponName = weaponDef.name;
                    break;
                }
            }

            allWeapons.push({
                hash: weapon.hash,
                name: weaponName,
                ammo: player.getWeaponAmmo(weapon.hash),
                tintIndex: weapon.tintIndex,
                components: weapon.components || [],
            });
        }

        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error removing weapon component:', error);
    }
});
