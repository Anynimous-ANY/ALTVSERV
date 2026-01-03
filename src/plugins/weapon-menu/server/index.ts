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

// Get component price based on component hash
function getComponentPrice(componentHash: number): number {
    // Define pricing based on component type
    const suppressorHashes = [0x65EA7EBB, 0xC304849A, 0xA73D4664, 0x837445AA, 0x8C8DCC43, 0xA564D78B];
    const extendedClipHashes = [0xED265A1C, 0xD67B4F2D, 0x249A17D5, 0xD9D3AC92, 0x7B0033B3, 0x64F9C62B];
    const flashlightHashes = [0x359B7AAE, 0x9D65907A, 0xAF89DCE3];
    const scopeHashes = [0xBC54DA77, 0x1B4C088B, 0xA0D89C42, 0x3CC6BA57, 0x9BC64089];
    const gripHashes = [0xC164F53, 0xB1929A4, 0x9D2FBF29];
    const luxuryFinishHashes = [0xD7391086, 0xC6654D72, 0x9B76C72C, 0x77B8AB2F, 0x80DA5257];
    
    if (suppressorHashes.includes(componentHash)) return 5000;
    if (extendedClipHashes.includes(componentHash)) return 3000;
    if (flashlightHashes.includes(componentHash)) return 2000;
    if (scopeHashes.includes(componentHash)) return 8000;
    if (gripHashes.includes(componentHash)) return 2500;
    if (luxuryFinishHashes.includes(componentHash)) return 10000;
    
    // Default price for other components
    return 1500;
}

// Get component name from hash
function getComponentName(componentHash: number): string {
    const components: { [key: number]: string } = {
        0x65EA7EBB: 'Suppressor',
        0xC304849A: 'Suppressor',
        0xA73D4664: 'Suppressor',
        0xED265A1C: 'Extended Clip',
        0xD67B4F2D: 'Extended Clip',
        0x249A17D5: 'Extended Clip',
        0x359B7AAE: 'Flashlight',
        0xBC54DA77: 'Scope',
        0xC164F53: 'Grip',
        0xD7391086: 'Luxury Finish',
    };
    return components[componentHash] || `Component ${componentHash.toString(16)}`;
}

// Get tint price based on tint index
function getTintPrice(tintIndex: number): number {
    const tintPrices: { [key: number]: number } = {
        0: 0,      // Normal - Free
        1: 500,    // Green
        2: 2000,   // Gold
        3: 1500,   // Pink
        4: 1000,   // Army
        5: 800,    // LSPD
        6: 1200,   // Orange
        7: 5000,   // Platinum
    };
    return tintPrices[tintIndex] ?? 0;
}

// Get tint name from index
function getTintName(tintIndex: number): string {
    const tintNames: { [key: number]: string } = {
        0: 'Normal',
        1: 'Green',
        2: 'Gold',
        3: 'Pink',
        4: 'Army',
        5: 'LSPD',
        6: 'Orange',
        7: 'Platinum',
    };
    return tintNames[tintIndex] ?? `Tint ${tintIndex}`;
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
                        hash: weaponDef.hash, // String hash for display and image lookup
                        numericHash: weapon.hash, // Numeric hash for server operations
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
                        hash: weaponDef.hash, // Use string hash from weaponDef
                        
                        numericHash: weapon.hash, // Numeric hash for server operations
                        name: weaponDef.name,
                        image: weaponDef.image, // Include image property
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

        // Get tint price
        const tintPrice = getTintPrice(tintIndex);
        const tintName = getTintName(tintIndex);

        // Check if tint costs money
        if (tintPrice > 0) {
            // Get money API
            const moneyApi = Rebar.useApi().get('money-api');
            if (!moneyApi) {
                rPlayer.notify.showNotification('Money system not available');
                return;
            }

            // Check player money
            const playerMoney = moneyApi.getPlayerMoney(player);
            if (playerMoney < tintPrice) {
                rPlayer.notify.showNotification(`Insufficient funds! ${tintName} tint costs ${tintPrice}€, you have ${playerMoney}€`);
                return;
            }

            // Deduct money
            const success = await moneyApi.removePlayerMoney(player, tintPrice);
            if (!success) {
                rPlayer.notify.showNotification(`Failed to process payment for ${tintName} tint (${tintPrice}€)`);
                return;
            }
        }

        // Set the weapon tint
        player.setWeaponTintIndex(weaponHash, tintIndex);

        if (tintPrice > 0) {
            rPlayer.notify.showNotification(`${tintName} tint applied for ${tintPrice}€`);
        } else {
            rPlayer.notify.showNotification(`${tintName} tint applied`);
        }

        // Send updated weapons list using player.weapons array
        const allWeapons: any[] = [];
        if (player.weapons && Array.isArray(player.weapons)) {
            for (const weapon of player.weapons) {
                const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
                
                if (weaponDef) {
                    const ammo = player.getWeaponAmmo(weapon.hash);
                    
                    allWeapons.push({
                        hash: weaponDef.hash, // Use string hash from weaponDef
                        
                        numericHash: weapon.hash, // Numeric hash for server operations
                        name: weaponDef.name,
                        image: weaponDef.image, // Include image property
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
                        hash: weaponDef.hash, // Use string hash from weaponDef
                        
                        numericHash: weapon.hash, // Numeric hash for server operations
                        name: weaponDef.name,
                        image: weaponDef.image, // Include image property
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

        // Get component price
        const componentPrice = getComponentPrice(componentHash);
        const componentName = getComponentName(componentHash);

        // Check if component costs money
        if (componentPrice > 0) {
            // Get money API
            const moneyApi = Rebar.useApi().get('money-api');
            if (!moneyApi) {
                rPlayer.notify.showNotification('Money system not available');
                return;
            }

            // Check player money
            const playerMoney = moneyApi.getPlayerMoney(player);
            if (playerMoney < componentPrice) {
                rPlayer.notify.showNotification(`Insufficient funds! ${componentName} costs ${componentPrice}€, you have ${playerMoney}€`);
                return;
            }

            // Deduct money
            const success = await moneyApi.removePlayerMoney(player, componentPrice);
            if (!success) {
                rPlayer.notify.showNotification(`Failed to process payment for ${componentName} (${componentPrice}€)`);
                return;
            }
        }

        // Simply add the component using native method
        // The game engine handles all visual updates and persistence
        player.addWeaponComponent(weaponHash, componentHash);
        console.log(`[WeaponMenu] Component ${componentHash} added to weapon ${weaponHash}`);

        if (componentPrice > 0) {
            rPlayer.notify.showNotification(`${componentName} added for ${componentPrice}€`);
        } else {
            rPlayer.notify.showNotification(`${componentName} added`);
        }

        // Send updated weapons list
        const allWeapons: any[] = [];
        for (const weapon of player.weapons) {
            // Find the weapon definition
            const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
            
            if (weaponDef) {
                const ammo = player.getWeaponAmmo(weapon.hash);
                
                allWeapons.push({
                    hash: weaponDef.hash, // Use string hash from weaponDef
                    
                        numericHash: weapon.hash, // Numeric hash for server operations
                        name: weaponDef.name,
                    image: weaponDef.image, // Include image property
                    ammo: ammo,
                    tintIndex: weapon.tintIndex,
                    components: weapon.components || [],
                });
            }
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
            // Find the weapon definition
            const weaponDef = WEAPONS.find(w => alt.hash(w.hash) === weapon.hash);
            
            if (weaponDef) {
                const ammo = player.getWeaponAmmo(weapon.hash);
                
                allWeapons.push({
                    hash: weaponDef.hash, // Use string hash from weaponDef
                    
                        numericHash: weapon.hash, // Numeric hash for server operations
                        name: weaponDef.name,
                    image: weaponDef.image, // Include image property
                    ammo: ammo,
                    tintIndex: weapon.tintIndex,
                    components: weapon.components || [],
                });
            }
        }

        const webview = Rebar.player.useWebview(player);
        webview.emit(WeaponMenuEvents.toWebview.setCurrentWeapons, allWeapons);
    } catch (error) {
        console.error('Error removing weapon component:', error);
    }
});
