/**
 * Common weapon components (attachments) for GTA V weapons
 * These are component hashes that can be added to weapons
 */

export interface WeaponComponent {
    name: string;
    hash: number;
    weaponHashes: string[]; // Weapons that can use this component
}

export const WEAPON_COMPONENTS: WeaponComponent[] = [
    // Flashlight
    { name: 'Flashlight', hash: 0x359B7AAE, weaponHashes: ['weapon_pistol', 'weapon_combatpistol', 'weapon_appistol', 'weapon_pistol50', 'weapon_heavypistol', 'weapon_smg', 'weapon_assaultsmg', 'weapon_assaultrifle', 'weapon_carbinerifle', 'weapon_advancedrifle', 'weapon_specialcarbine', 'weapon_bullpuprifle', 'weapon_pumpshotgun', 'weapon_assaultshotgun', 'weapon_bullpupshotgun', 'weapon_heavyshotgun', 'weapon_marksmanrifle'] },
    
    // Suppressors
    { name: 'Suppressor', hash: 0x65EA7EBB, weaponHashes: ['weapon_pistol', 'weapon_combatpistol', 'weapon_appistol', 'weapon_pistol50', 'weapon_snspistol', 'weapon_heavypistol', 'weapon_vintagepistol', 'weapon_marksmanpistol'] },
    { name: 'Suppressor', hash: 0xA73D4664, weaponHashes: ['weapon_microsmg', 'weapon_smg', 'weapon_assaultsmg'] },
    { name: 'Suppressor', hash: 0x837445AA, weaponHashes: ['weapon_assaultrifle', 'weapon_carbinerifle', 'weapon_advancedrifle', 'weapon_specialcarbine', 'weapon_bullpuprifle'] },
    { name: 'Suppressor', hash: 0xE608B35E, weaponHashes: ['weapon_pumpshotgun', 'weapon_heavyshotgun'] },
    { name: 'Suppressor', hash: 0x6927E1A4, weaponHashes: ['weapon_sniperrifle'] },
    { name: 'Suppressor', hash: 0xAC42DF71, weaponHashes: ['weapon_heavysniper'] },
    
    // Extended Clip / Magazine
    { name: 'Extended Clip', hash: 0xED265A1C, weaponHashes: ['weapon_pistol', 'weapon_combatpistol', 'weapon_appistol', 'weapon_pistol50', 'weapon_snspistol', 'weapon_heavypistol', 'weapon_vintagepistol'] },
    { name: 'Extended Clip', hash: 0x10E6BA2B, weaponHashes: ['weapon_microsmg'] },
    { name: 'Extended Clip', hash: 0xBEE92A63, weaponHashes: ['weapon_smg', 'weapon_assaultsmg', 'weapon_combatpdw', 'weapon_machinepistol', 'weapon_minismg'] },
    { name: 'Extended Clip', hash: 0xD49C2A91, weaponHashes: ['weapon_assaultrifle', 'weapon_carbinerifle', 'weapon_advancedrifle', 'weapon_specialcarbine', 'weapon_bullpuprifle', 'weapon_compactrifle'] },
    { name: 'Extended Clip', hash: 0x971CF6FD, weaponHashes: ['weapon_assaultshotgun'] },
    { name: 'Extended Clip', hash: 0x9BC64089, weaponHashes: ['weapon_heavyshotgun'] },
    { name: 'Extended Clip', hash: 0x10BF1098, weaponHashes: ['weapon_mg', 'weapon_combatmg'] },
    { name: 'Extended Clip', hash: 0x57103969, weaponHashes: ['weapon_marksmanrifle'] },
    
    // Grips
    { name: 'Grip', hash: 0xC164F53, weaponHashes: ['weapon_combatpistol', 'weapon_appistol', 'weapon_pistol50', 'weapon_heavypistol'] },
    { name: 'Grip', hash: 0x9D2FBF29, weaponHashes: ['weapon_assaultsmg', 'weapon_combatpdw'] },
    { name: 'Grip', hash: 0xC78C77DD, weaponHashes: ['weapon_assaultrifle', 'weapon_carbinerifle', 'weapon_advancedrifle', 'weapon_specialcarbine', 'weapon_bullpuprifle'] },
    { name: 'Grip', hash: 0xC6654D72, weaponHashes: ['weapon_mg', 'weapon_combatmg'] },
    { name: 'Grip', hash: 0x63ADABB0, weaponHashes: ['weapon_marksmanrifle'] },
    
    // Scopes
    { name: 'Scope', hash: 0x9D2FBFAA, weaponHashes: ['weapon_pistol50', 'weapon_heavypistol', 'weapon_marksmanpistol'] },
    { name: 'Scope', hash: 0x3CC6BA57, weaponHashes: ['weapon_assaultrifle', 'weapon_carbinerifle', 'weapon_advancedrifle', 'weapon_specialcarbine', 'weapon_bullpuprifle'] },
    { name: 'Scope', hash: 'weapon_scope', weaponHashes: ['weapon_sniperrifle', 'weapon_heavysniper', 'weapon_marksmanrifle'] },
    { name: 'Advanced Scope', hash: 0xD2443DDC, weaponHashes: ['weapon_heavysniper'] },
    
    // Luxury Finish
    { name: 'Luxury Finish', hash: 0x7A6A7B7B, weaponHashes: ['weapon_pistol'] },
];

// Weapon tint indices
export const WEAPON_TINTS = [
    { id: 0, name: 'Default' },
    { id: 1, name: 'Green' },
    { id: 2, name: 'Gold' },
    { id: 3, name: 'Pink' },
    { id: 4, name: 'Army' },
    { id: 5, name: 'LSPD' },
    { id: 6, name: 'Orange' },
    { id: 7, name: 'Platinum' },
];
