export interface Weapon {
    name: string;
    hash: string;
    category: string;
}

export const WEAPONS: Weapon[] = [
    // Melee Weapons
    { name: 'Knife', hash: 'weapon_knife', category: 'Melee' },
    { name: 'Nightstick', hash: 'weapon_nightstick', category: 'Melee' },
    { name: 'Hammer', hash: 'weapon_hammer', category: 'Melee' },
    { name: 'Bat', hash: 'weapon_bat', category: 'Melee' },
    { name: 'Golf Club', hash: 'weapon_golfclub', category: 'Melee' },
    { name: 'Crowbar', hash: 'weapon_crowbar', category: 'Melee' },
    { name: 'Bottle', hash: 'weapon_bottle', category: 'Melee' },
    { name: 'Dagger', hash: 'weapon_dagger', category: 'Melee' },
    { name: 'Hatchet', hash: 'weapon_hatchet', category: 'Melee' },
    { name: 'Knuckle Duster', hash: 'weapon_knuckle', category: 'Melee' },
    { name: 'Machete', hash: 'weapon_machete', category: 'Melee' },
    { name: 'Flashlight', hash: 'weapon_flashlight', category: 'Melee' },
    { name: 'Switchblade', hash: 'weapon_switchblade', category: 'Melee' },
    { name: 'Pool Cue', hash: 'weapon_poolcue', category: 'Melee' },
    { name: 'Wrench', hash: 'weapon_wrench', category: 'Melee' },
    { name: 'Battle Axe', hash: 'weapon_battleaxe', category: 'Melee' },

    // Handguns
    { name: 'Pistol', hash: 'weapon_pistol', category: 'Handguns' },
    { name: 'Combat Pistol', hash: 'weapon_combatpistol', category: 'Handguns' },
    { name: 'AP Pistol', hash: 'weapon_appistol', category: 'Handguns' },
    { name: 'Pistol .50', hash: 'weapon_pistol50', category: 'Handguns' },
    { name: 'SNS Pistol', hash: 'weapon_snspistol', category: 'Handguns' },
    { name: 'Heavy Pistol', hash: 'weapon_heavypistol', category: 'Handguns' },
    { name: 'Vintage Pistol', hash: 'weapon_vintagepistol', category: 'Handguns' },
    { name: 'Marksman Pistol', hash: 'weapon_marksmanpistol', category: 'Handguns' },
    { name: 'Heavy Revolver', hash: 'weapon_revolver', category: 'Handguns' },
    { name: 'Double Action Revolver', hash: 'weapon_doubleaction', category: 'Handguns' },
    { name: 'Ceramic Pistol', hash: 'weapon_ceramicpistol', category: 'Handguns' },
    { name: 'Navy Revolver', hash: 'weapon_navyrevolver', category: 'Handguns' },

    // Submachine Guns
    { name: 'Micro SMG', hash: 'weapon_microsmg', category: 'SMGs' },
    { name: 'SMG', hash: 'weapon_smg', category: 'SMGs' },
    { name: 'Assault SMG', hash: 'weapon_assaultsmg', category: 'SMGs' },
    { name: 'Combat PDW', hash: 'weapon_combatpdw', category: 'SMGs' },
    { name: 'Machine Pistol', hash: 'weapon_machinepistol', category: 'SMGs' },
    { name: 'Mini SMG', hash: 'weapon_minismg', category: 'SMGs' },

    // Shotguns
    { name: 'Pump Shotgun', hash: 'weapon_pumpshotgun', category: 'Shotguns' },
    { name: 'Sawed-Off Shotgun', hash: 'weapon_sawnoffshotgun', category: 'Shotguns' },
    { name: 'Assault Shotgun', hash: 'weapon_assaultshotgun', category: 'Shotguns' },
    { name: 'Bullpup Shotgun', hash: 'weapon_bullpupshotgun', category: 'Shotguns' },
    { name: 'Heavy Shotgun', hash: 'weapon_heavyshotgun', category: 'Shotguns' },
    { name: 'Double Barrel Shotgun', hash: 'weapon_dbshotgun', category: 'Shotguns' },
    { name: 'Sweeper Shotgun', hash: 'weapon_autoshotgun', category: 'Shotguns' },

    // Assault Rifles
    { name: 'Assault Rifle', hash: 'weapon_assaultrifle', category: 'Assault Rifles' },
    { name: 'Carbine Rifle', hash: 'weapon_carbinerifle', category: 'Assault Rifles' },
    { name: 'Advanced Rifle', hash: 'weapon_advancedrifle', category: 'Assault Rifles' },
    { name: 'Special Carbine', hash: 'weapon_specialcarbine', category: 'Assault Rifles' },
    { name: 'Bullpup Rifle', hash: 'weapon_bullpuprifle', category: 'Assault Rifles' },
    { name: 'Compact Rifle', hash: 'weapon_compactrifle', category: 'Assault Rifles' },

    // Machine Guns
    { name: 'MG', hash: 'weapon_mg', category: 'Machine Guns' },
    { name: 'Combat MG', hash: 'weapon_combatmg', category: 'Machine Guns' },
    { name: 'Gusenberg Sweeper', hash: 'weapon_gusenberg', category: 'Machine Guns' },

    // Sniper Rifles
    { name: 'Sniper Rifle', hash: 'weapon_sniperrifle', category: 'Sniper Rifles' },
    { name: 'Heavy Sniper', hash: 'weapon_heavysniper', category: 'Sniper Rifles' },
    { name: 'Marksman Rifle', hash: 'weapon_marksmanrifle', category: 'Sniper Rifles' },

    // Heavy Weapons
    { name: 'RPG', hash: 'weapon_rpg', category: 'Heavy Weapons' },
    { name: 'Grenade Launcher', hash: 'weapon_grenadelauncher', category: 'Heavy Weapons' },
    { name: 'Minigun', hash: 'weapon_minigun', category: 'Heavy Weapons' },
    { name: 'Firework Launcher', hash: 'weapon_firework', category: 'Heavy Weapons' },
    { name: 'Homing Launcher', hash: 'weapon_hominglauncher', category: 'Heavy Weapons' },
    { name: 'Compact Grenade Launcher', hash: 'weapon_compactlauncher', category: 'Heavy Weapons' },

    // Throwables
    { name: 'Grenade', hash: 'weapon_grenade', category: 'Throwables' },
    { name: 'Sticky Bomb', hash: 'weapon_stickybomb', category: 'Throwables' },
    { name: 'Proximity Mine', hash: 'weapon_proxmine', category: 'Throwables' },
    { name: 'BZ Gas', hash: 'weapon_bzgas', category: 'Throwables' },
    { name: 'Molotov', hash: 'weapon_molotov', category: 'Throwables' },
    { name: 'Flare', hash: 'weapon_flare', category: 'Throwables' },

    // Misc
    { name: 'Jerry Can', hash: 'weapon_petrolcan', category: 'Misc' },
    { name: 'Fire Extinguisher', hash: 'weapon_fireextinguisher', category: 'Misc' },
];
