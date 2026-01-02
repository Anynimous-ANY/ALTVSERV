export interface Weapon {
    name: string;
    hash: string;
    category: string;
    ammo?: number;
}

export const WEAPONS: Weapon[] = [
    // Melee Weapons
    { name: 'Unarmed', hash: 'weapon_unarmed', category: 'Melee', ammo: 0 },
    { name: 'Knife', hash: 'weapon_knife', category: 'Melee', ammo: 0 },
    { name: 'Nightstick', hash: 'weapon_nightstick', category: 'Melee', ammo: 0 },
    { name: 'Hammer', hash: 'weapon_hammer', category: 'Melee', ammo: 0 },
    { name: 'Bat', hash: 'weapon_bat', category: 'Melee', ammo: 0 },
    { name: 'Golf Club', hash: 'weapon_golfclub', category: 'Melee', ammo: 0 },
    { name: 'Crowbar', hash: 'weapon_crowbar', category: 'Melee', ammo: 0 },
    { name: 'Bottle', hash: 'weapon_bottle', category: 'Melee', ammo: 0 },
    { name: 'Antique Cavalry Dagger', hash: 'weapon_dagger', category: 'Melee', ammo: 0 },
    { name: 'Hatchet', hash: 'weapon_hatchet', category: 'Melee', ammo: 0 },
    { name: 'Knuckle Duster', hash: 'weapon_knuckle', category: 'Melee', ammo: 0 },
    { name: 'Machete', hash: 'weapon_machete', category: 'Melee', ammo: 0 },
    { name: 'Flashlight', hash: 'weapon_flashlight', category: 'Melee', ammo: 0 },
    { name: 'Switchblade', hash: 'weapon_switchblade', category: 'Melee', ammo: 0 },
    { name: 'Pool Cue', hash: 'weapon_poolcue', category: 'Melee', ammo: 0 },
    { name: 'Wrench', hash: 'weapon_wrench', category: 'Melee', ammo: 0 },
    { name: 'Battle Axe', hash: 'weapon_battleaxe', category: 'Melee', ammo: 0 },
    { name: 'Stone Hatchet', hash: 'weapon_stone_hatchet', category: 'Melee', ammo: 0 },
    { name: 'Candy Cane', hash: 'weapon_candycane', category: 'Melee', ammo: 0 },
    { name: 'The shocker', hash: 'weapon_stunrod', category: 'Melee', ammo: 0 },

    // Handguns
    { name: 'Pistol', hash: 'weapon_pistol', category: 'Handguns', ammo: 250 },
    { name: 'Combat Pistol', hash: 'weapon_combatpistol', category: 'Handguns', ammo: 250 },
    { name: 'AP Pistol', hash: 'weapon_appistol', category: 'Handguns', ammo: 250 },
    { name: 'Stun Gun', hash: 'weapon_stungun', category: 'Handguns', ammo: 250 },
    { name: 'Pistol .50', hash: 'weapon_pistol50', category: 'Handguns', ammo: 250 },
    { name: 'SNS Pistol', hash: 'weapon_snspistol', category: 'Handguns', ammo: 250 },
    { name: 'Heavy Pistol', hash: 'weapon_heavypistol', category: 'Handguns', ammo: 250 },
    { name: 'Vintage Pistol', hash: 'weapon_vintagepistol', category: 'Handguns', ammo: 250 },
    { name: 'Flare Gun', hash: 'weapon_flaregun', category: 'Handguns', ammo: 250 },
    { name: 'Marksman Pistol', hash: 'weapon_marksmanpistol', category: 'Handguns', ammo: 250 },
    { name: 'Heavy Revolver', hash: 'weapon_revolver', category: 'Handguns', ammo: 250 },
    { name: 'Double Action Revolver', hash: 'weapon_doubleaction', category: 'Handguns', ammo: 250 },
    { name: 'Up-n-Atomizer', hash: 'weapon_raypistol', category: 'Handguns', ammo: 250 },
    { name: 'Ceramic Pistol', hash: 'weapon_ceramicpistol', category: 'Handguns', ammo: 250 },
    { name: 'Navy Revolver', hash: 'weapon_navyrevolver', category: 'Handguns', ammo: 250 },
    { name: 'Perico Pistol', hash: 'weapon_gadgetpistol', category: 'Handguns', ammo: 250 },
    { name: 'Pistol Mk II', hash: 'weapon_pistol_mk2', category: 'Handguns', ammo: 250 },
    { name: 'SNS Pistol Mk II', hash: 'weapon_snspistol_mk2', category: 'Handguns', ammo: 250 },
    { name: 'Heavy Revolver Mk II', hash: 'weapon_revolver_mk2', category: 'Handguns', ammo: 250 },
    { name: 'Stun Gun a chier', hash: 'weapon_stungun_mp', category: 'Handguns', ammo: 250 },
    { name: 'WM 29 Pistol', hash: 'weapon_pistolxm3', category: 'Handguns', ammo: 250 },

    // Submachine Guns
    { name: 'Micro SMG', hash: 'weapon_microsmg', category: 'SMGs', ammo: 500 },
    { name: 'SMG', hash: 'weapon_smg', category: 'SMGs', ammo: 500 },
    { name: 'Assault SMG', hash: 'weapon_assaultsmg', category: 'SMGs', ammo: 500 },
    { name: 'Combat PDW', hash: 'weapon_combatpdw', category: 'SMGs', ammo: 500 },
    { name: 'Machine Pistol', hash: 'weapon_machinepistol', category: 'SMGs', ammo: 500 },
    { name: 'Mini SMG', hash: 'weapon_minismg', category: 'SMGs', ammo: 500 },
    { name: 'Unholy Hellbringer', hash: 'weapon_raycarbine', category: 'SMGs', ammo: 500 },
    { name: 'SMG Mk II', hash: 'weapon_smg_mk2', category: 'SMGs', ammo: 500 },
    { name: 'Tactical SMG', hash: 'weapon_tecpistol', category: 'SMGs', ammo: 500 },

    // Shotguns
    { name: 'Pump Shotgun', hash: 'weapon_pumpshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Sawed-Off Shotgun', hash: 'weapon_sawnoffshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Assault Shotgun', hash: 'weapon_assaultshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Bullpup Shotgun', hash: 'weapon_bullpupshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Heavy Shotgun', hash: 'weapon_heavyshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Double Barrel Shotgun', hash: 'weapon_dbshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Sweeper Shotgun', hash: 'weapon_autoshotgun', category: 'Shotguns', ammo: 250 },
    { name: 'Pump Shotgun Mk II', hash: 'weapon_pumpshotgun_mk2', category: 'Shotguns', ammo: 250 },
    { name: 'Combat Shotgun', hash: 'weapon_combatshotgun', category: 'Shotguns', ammo: 250 },

    // Assault Rifles
    { name: 'Assault Rifle', hash: 'weapon_assaultrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Carbine Rifle', hash: 'weapon_carbinerifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Advanced Rifle', hash: 'weapon_advancedrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Special Carbine', hash: 'weapon_specialcarbine', category: 'Assault Rifles', ammo: 750 },
    { name: 'Bullpup Rifle', hash: 'weapon_bullpuprifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Compact Rifle', hash: 'weapon_compactrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Military Rifle', hash: 'weapon_militaryrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Heavy Rifle', hash: 'weapon_heavyrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Tactical Rifle', hash: 'weapon_tacticalrifle', category: 'Assault Rifles', ammo: 750 },
    { name: 'Assault Rifle Mk II', hash: 'weapon_assaultrifle_mk2', category: 'Assault Rifles', ammo: 750 },
    { name: 'Carbine Rifle Mk II', hash: 'weapon_carbinerifle_mk2', category: 'Assault Rifles', ammo: 750 },
    { name: 'Special Carbine Mk II', hash: 'weapon_specialcarbine_mk2', category: 'Assault Rifles', ammo: 750 },
    { name: 'Bullpup Rifle Mk II', hash: 'weapon_bullpuprifle_mk2', category: 'Assault Rifles', ammo: 750 },

    // Machine Guns
    { name: 'MG', hash: 'weapon_mg', category: 'Machine Guns', ammo: 1000 },
    { name: 'Combat MG', hash: 'weapon_combatmg', category: 'Machine Guns', ammo: 1000 },
    { name: 'Gusenberg Sweeper', hash: 'weapon_gusenberg', category: 'Machine Guns', ammo: 1000 },
    { name: 'Combat MG Mk II', hash: 'weapon_combatmg_mk2', category: 'Machine Guns', ammo: 1000 },

    // Sniper Rifles
    { name: 'Sniper Rifle', hash: 'weapon_sniperrifle', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Heavy Sniper', hash: 'weapon_heavysniper', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Marksman Rifle', hash: 'weapon_marksmanrifle', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Precision Rifle', hash: 'weapon_precisionrifle', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Heavy Sniper Mk II', hash: 'weapon_heavysniper_mk2', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Marksman Rifle Mk II', hash: 'weapon_marksmanrifle_mk2', category: 'Sniper Rifles', ammo: 250 },
    { name: 'Musket', hash: 'weapon_musket', category: 'Shotguns', ammo: 250 },

    // Heavy Weapons
    { name: 'RPG', hash: 'weapon_rpg', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Grenade Launcher', hash: 'weapon_grenadelauncher', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Minigun', hash: 'weapon_minigun', category: 'Heavy Weapons', ammo: 5000 },
    { name: 'Firework Launcher', hash: 'weapon_firework', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Homing Launcher', hash: 'weapon_hominglauncher', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Compact Grenade Launcher', hash: 'weapon_compactlauncher', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Widowmaker', hash: 'weapon_rayminigun', category: 'Heavy Weapons', ammo: 5000 },
    { name: 'Railgun', hash: 'weapon_railgun', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Compact EMP Launcher', hash: 'weapon_emplauncher', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Railgun', hash: 'weapon_railgunxm3', category: 'Heavy Weapons', ammo: 20 },
    { name: 'Grenade Launcher Smoke', hash: 'weapon_grenadelauncher_smoke', category: 'Heavy Weapons', ammo: 20 },

    // Throwables
    { name: 'Grenade', hash: 'weapon_grenade', category: 'Throwables', ammo: 25 },
    { name: 'Sticky Bomb', hash: 'weapon_stickybomb', category: 'Throwables', ammo: 25 },
    { name: 'Proximity Mine', hash: 'weapon_proxmine', category: 'Throwables', ammo: 25 },
    { name: 'BZ Gas', hash: 'weapon_bzgas', category: 'Throwables', ammo: 25 },
    { name: 'Molotov', hash: 'weapon_molotov', category: 'Throwables', ammo: 25 },
    { name: 'Flare', hash: 'weapon_flare', category: 'Throwables', ammo: 25 },
    { name: 'Pipe Bomb', hash: 'weapon_pipebomb', category: 'Throwables', ammo: 25 },
    { name: 'Snowball', hash: 'weapon_snowball', category: 'Throwables', ammo: 25 },
    { name: 'Ball', hash: 'weapon_ball', category: 'Throwables', ammo: 25 },
    { name: 'Smoke Grenade', hash: 'weapon_smokegrenade', category: 'Throwables', ammo: 25 },
    { name: 'Tear Gas', hash: 'weapon_teargas', category: 'Throwables', ammo: 25 },

    // Misc
    { name: 'Jerry Can', hash: 'weapon_petrolcan', category: 'Misc', ammo: 1000 },
    { name: 'Fire Extinguisher', hash: 'weapon_fireextinguisher', category: 'Misc', ammo: 1000 },
    { name: 'Parachute', hash: 'gadget_parachute', category: 'Misc', ammo: 0 },
    { name: 'Hazardous Jerry Can', hash: 'weapon_hazardcan', category: 'Misc', ammo: 1000 },
    { name: 'Fertilizer Can', hash: 'weapon_fertilizercan', category: 'Misc', ammo: 1000 },
];
