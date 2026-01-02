import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WEAPONS } from '../shared/weapons.js';

const API_NAME = 'weapon-menu-api';
const Rebar = useRebar();

/**
 * API for other plugins to interact with the weapon menu system
 */
function useApi() {
    /**
     * Open the weapon menu for a player
     * @param player - The player to show the menu to
     */
    function openWeaponMenu(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        const webview = Rebar.player.useWebview(player);
        webview.show('WeaponMenu', 'page');
    }

    /**
     * Close the weapon menu for a player
     * @param player - The player to hide the menu from
     */
    function closeWeaponMenu(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        const webview = Rebar.player.useWebview(player);
        webview.hide('WeaponMenu');
    }

    /**
     * Give a weapon to a player by hash
     * @param player - The player to give the weapon to
     * @param weaponHash - The weapon hash
     * @returns true if successful, false otherwise
     */
    function giveWeapon(player: alt.Player, weaponHash: string): boolean {
        if (!player || !player.valid) {
            return false;
        }

        const weaponData = WEAPONS.find((w) => w.hash === weaponHash);
        if (!weaponData) {
            return false;
        }

        try {
            const ammo = weaponData.ammo ?? 999;
            player.giveWeapon(alt.hash(weaponHash), ammo, true);
            return true;
        } catch (error) {
            console.error('Error giving weapon:', error);
            return false;
        }
    }

    /**
     * Get all available weapons
     * @returns Array of all weapons
     */
    function getAllWeapons() {
        return [...WEAPONS];
    }

    /**
     * Get player's favorite weapons
     * @param player - The player
     * @returns Array of favorite weapon hashes
     */
    function getFavorites(player: alt.Player): string[] {
        if (!player || !player.valid) {
            return [];
        }

        const document = Rebar.document.character.useCharacter(player);
        const data = document.get();

        if (!data) {
            return [];
        }

        return (data.favoriteWeapons as string[]) || [];
    }

    /**
     * Add a weapon to favorites
     * @param player - The player
     * @param weaponHash - The weapon hash to add
     * @returns true if successful, false otherwise
     */
    async function addFavorite(player: alt.Player, weaponHash: string): Promise<boolean> {
        if (!player || !player.valid) {
            return false;
        }

        const weaponData = WEAPONS.find((w) => w.hash === weaponHash);
        if (!weaponData) {
            return false;
        }

        try {
            const document = Rebar.document.character.useCharacter(player);
            const data = document.get();

            if (!data) {
                return false;
            }

            let favorites: string[] = (data.favoriteWeapons as string[]) || [];

            if (favorites.includes(weaponHash)) {
                return true; // Already in favorites
            }

            if (favorites.length >= 20) {
                return false; // Max favorites reached
            }

            favorites.push(weaponHash);
            return await document.setBulk({ favoriteWeapons: favorites });
        } catch (error) {
            console.error('Error adding favorite:', error);
            return false;
        }
    }

    /**
     * Remove a weapon from favorites
     * @param player - The player
     * @param weaponHash - The weapon hash to remove
     * @returns true if successful, false otherwise
     */
    async function removeFavorite(player: alt.Player, weaponHash: string): Promise<boolean> {
        if (!player || !player.valid) {
            return false;
        }

        try {
            const document = Rebar.document.character.useCharacter(player);
            const data = document.get();

            if (!data) {
                return false;
            }

            let favorites: string[] = (data.favoriteWeapons as string[]) || [];
            const index = favorites.indexOf(weaponHash);

            if (index === -1) {
                return true; // Not in favorites
            }

            favorites.splice(index, 1);
            return await document.setBulk({ favoriteWeapons: favorites });
        } catch (error) {
            console.error('Error removing favorite:', error);
            return false;
        }
    }

    return {
        openWeaponMenu,
        closeWeaponMenu,
        giveWeapon,
        getAllWeapons,
        getFavorites,
        addFavorite,
        removeFavorite,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof useApi>;
    }
}

Rebar.useApi().register(API_NAME, useApi());
