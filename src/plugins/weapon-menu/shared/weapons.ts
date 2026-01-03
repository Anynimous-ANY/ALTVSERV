export interface Weapon {
    name: string;
    hash: string;
    category: string;
    ammo?: number;
    price: number;
    image?: string;
}

export const WEAPONS: Weapon[] = [
    // Melee Weapons
    { name: 'Unarmed', hash: 'weapon_unarmed', category: 'Melee', ammo: 0, price: 0, image: 'weapon_unarmed.png' },
    { name: 'Knife', hash: 'weapon_knife', category: 'Melee', ammo: 0, price: 50, image: 'weapon_knife.png' },
    { name: 'Nightstick', hash: 'weapon_nightstick', category: 'Melee', ammo: 0, price: 75, image: 'weapon_nightstick.png' },
    { name: 'Hammer', hash: 'weapon_hammer', category: 'Melee', ammo: 0, price: 100, image: 'weapon_hammer.png' },
    { name: 'Bat', hash: 'weapon_bat', category: 'Melee', ammo: 0, price: 80, image: 'weapon_bat.png' },
    { name: 'Golf Club', hash: 'weapon_golfclub', category: 'Melee', ammo: 0, price: 120, image: 'weapon_golfclub.png' },
    { name: 'Crowbar', hash: 'weapon_crowbar', category: 'Melee', ammo: 0, price: 90, image: 'weapon_crowbar.png' },
    { name: 'Bottle', hash: 'weapon_bottle', category: 'Melee', ammo: 0, price: 20, image: 'weapon_bottle.png' },
    { name: 'Antique Cavalry Dagger', hash: 'weapon_dagger', category: 'Melee', ammo: 0, price: 200, image: 'weapon_dagger.png' },
    { name: 'Hatchet', hash: 'weapon_hatchet', category: 'Melee', ammo: 0, price: 150, image: 'weapon_hatchet.png' },
    { name: 'Knuckle Duster', hash: 'weapon_knuckle', category: 'Melee', ammo: 0, price: 60, image: 'weapon_knuckle.png' },
    { name: 'Machete', hash: 'weapon_machete', category: 'Melee', ammo: 0, price: 180, image: 'weapon_machete.png' },
    { name: 'Flashlight', hash: 'weapon_flashlight', category: 'Melee', ammo: 0, price: 30, image: 'weapon_flashlight.png' },
    { name: 'Switchblade', hash: 'weapon_switchblade', category: 'Melee', ammo: 0, price: 110, image: 'weapon_switchblade.png' },
    { name: 'Pool Cue', hash: 'weapon_poolcue', category: 'Melee', ammo: 0, price: 70, image: 'weapon_poolcue.png' },
    { name: 'Wrench', hash: 'weapon_wrench', category: 'Melee', ammo: 0, price: 85, image: 'weapon_wrench.png' },
    { name: 'Battle Axe', hash: 'weapon_battleaxe', category: 'Melee', ammo: 0, price: 250, image: 'weapon_battleaxe.png' },
    { name: 'Stone Hatchet', hash: 'weapon_stone_hatchet', category: 'Melee', ammo: 0, price: 140, image: 'weapon_stone_hatchet.png' },
    { name: 'Candy Cane', hash: 'weapon_candycane', category: 'Melee', ammo: 0, price: 25, image: 'weapon_candycane.png' },
    { name: 'The shocker', hash: 'weapon_stunrod', category: 'Melee', ammo: 0, price: 300, image: 'weapon_stunrod.png' },

    // Handguns
    { name: 'Pistol', hash: 'weapon_pistol', category: 'Handguns', ammo: 250, price: 500, image: 'weapon_pistol.png' },
    { name: 'Combat Pistol', hash: 'weapon_combatpistol', category: 'Handguns', ammo: 250, price: 750, image: 'weapon_combatpistol.png' },
    { name: 'AP Pistol', hash: 'weapon_appistol', category: 'Handguns', ammo: 250, price: 900, image: 'weapon_appistol.png' },
    { name: 'Stun Gun', hash: 'weapon_stungun', category: 'Handguns', ammo: 250, price: 400, image: 'weapon_stungun.png' },
    { name: 'Pistol .50', hash: 'weapon_pistol50', category: 'Handguns', ammo: 250, price: 1200, image: 'weapon_pistol50.png' },
    { name: 'SNS Pistol', hash: 'weapon_snspistol', category: 'Handguns', ammo: 250, price: 300, image: 'weapon_snspistol.png' },
    { name: 'Heavy Pistol', hash: 'weapon_heavypistol', category: 'Handguns', ammo: 250, price: 850, image: 'weapon_heavypistol.png' },
    { name: 'Vintage Pistol', hash: 'weapon_vintagepistol', category: 'Handguns', ammo: 250, price: 650, image: 'weapon_vintagepistol.png' },
    { name: 'Flare Gun', hash: 'weapon_flaregun', category: 'Handguns', ammo: 250, price: 200, image: 'weapon_flaregun.png' },
    { name: 'Marksman Pistol', hash: 'weapon_marksmanpistol', category: 'Handguns', ammo: 250, price: 1500, image: 'weapon_marksmanpistol.png' },
    { name: 'Heavy Revolver', hash: 'weapon_revolver', category: 'Handguns', ammo: 250, price: 1100, image: 'weapon_revolver.png' },
    { name: 'Double Action Revolver', hash: 'weapon_doubleaction', category: 'Handguns', ammo: 250, price: 950, image: 'weapon_doubleaction.png' },
    { name: 'Up-n-Atomizer', hash: 'weapon_raypistol', category: 'Handguns', ammo: 250, price: 2500, image: 'weapon_raypistol.png' },
    { name: 'Ceramic Pistol', hash: 'weapon_ceramicpistol', category: 'Handguns', ammo: 250, price: 700, image: 'weapon_ceramicpistol.png' },
    { name: 'Navy Revolver', hash: 'weapon_navyrevolver', category: 'Handguns', ammo: 250, price: 1000, image: 'weapon_navyrevolver.png' },
    { name: 'Perico Pistol', hash: 'weapon_gadgetpistol', category: 'Handguns', ammo: 250, price: 800, image: 'weapon_gadgetpistol.png' },
    { name: 'Pistol Mk II', hash: 'weapon_pistol_mk2', category: 'Handguns', ammo: 250, price: 1400, image: 'weapon_pistol_mk2.png' },
    { name: 'SNS Pistol Mk II', hash: 'weapon_snspistol_mk2', category: 'Handguns', ammo: 250, price: 600, image: 'weapon_snspistol_mk2.png' },
    { name: 'Heavy Revolver Mk II', hash: 'weapon_revolver_mk2', category: 'Handguns', ammo: 250, price: 1600, image: 'weapon_revolver_mk2.png' },
    { name: 'Stun Gun a chier', hash: 'weapon_stungun_mp', category: 'Handguns', ammo: 250, price: 450, image: 'weapon_stungun_mp.png' },
    { name: 'WM 29 Pistol', hash: 'weapon_pistolxm3', category: 'Handguns', ammo: 250, price: 1300, image: 'weapon_pistolxm3.png' },

    // Submachine Guns
    { name: 'Micro SMG', hash: 'weapon_microsmg', category: 'SMGs', ammo: 500, price: 2000, image: 'weapon_microsmg.png' },
    { name: 'SMG', hash: 'weapon_smg', category: 'SMGs', ammo: 500, price: 2500, image: 'weapon_smg.png' },
    { name: 'Assault SMG', hash: 'weapon_assaultsmg', category: 'SMGs', ammo: 500, price: 3200, image: 'weapon_assaultsmg.png' },
    { name: 'Combat PDW', hash: 'weapon_combatpdw', category: 'SMGs', ammo: 500, price: 2800, image: 'weapon_combatpdw.png' },
    { name: 'Machine Pistol', hash: 'weapon_machinepistol', category: 'SMGs', ammo: 500, price: 1800, image: 'weapon_machinepistol.png' },
    { name: 'Mini SMG', hash: 'weapon_minismg', category: 'SMGs', ammo: 500, price: 2200, image: 'weapon_minismg.png' },
    { name: 'Unholy Hellbringer', hash: 'weapon_raycarbine', category: 'SMGs', ammo: 500, price: 5000, image: 'weapon_raycarbine.png' },
    { name: 'SMG Mk II', hash: 'weapon_smg_mk2', category: 'SMGs', ammo: 500, price: 3500, image: 'weapon_smg_mk2.png' },
    { name: 'Tactical SMG', hash: 'weapon_tecpistol', category: 'SMGs', ammo: 500, price: 2700, image: 'weapon_tecpistol.png' },

    // Shotguns
    { name: 'Pump Shotgun', hash: 'weapon_pumpshotgun', category: 'Shotguns', ammo: 250, price: 3500, image: 'weapon_pumpshotgun.png' },
    { name: 'Sawed-Off Shotgun', hash: 'weapon_sawnoffshotgun', category: 'Shotguns', ammo: 250, price: 2500, image: 'weapon_sawnoffshotgun.png' },
    { name: 'Assault Shotgun', hash: 'weapon_assaultshotgun', category: 'Shotguns', ammo: 250, price: 5000, image: 'weapon_assaultshotgun.png' },
    { name: 'Bullpup Shotgun', hash: 'weapon_bullpupshotgun', category: 'Shotguns', ammo: 250, price: 4200, image: 'weapon_bullpupshotgun.png' },
    { name: 'Heavy Shotgun', hash: 'weapon_heavyshotgun', category: 'Shotguns', ammo: 250, price: 4500, image: 'weapon_heavyshotgun.png' },
    { name: 'Double Barrel Shotgun', hash: 'weapon_dbshotgun', category: 'Shotguns', ammo: 250, price: 3000, image: 'weapon_dbshotgun.png' },
    { name: 'Sweeper Shotgun', hash: 'weapon_autoshotgun', category: 'Shotguns', ammo: 250, price: 5500, image: 'weapon_autoshotgun.png' },
    { name: 'Pump Shotgun Mk II', hash: 'weapon_pumpshotgun_mk2', category: 'Shotguns', ammo: 250, price: 4800, image: 'weapon_pumpshotgun_mk2.png' },
    { name: 'Combat Shotgun', hash: 'weapon_combatshotgun', category: 'Shotguns', ammo: 250, price: 6000, image: 'weapon_combatshotgun.png' },

    // Assault Rifles
    { name: 'Assault Rifle', hash: 'weapon_assaultrifle', category: 'Assault Rifles', ammo: 750, price: 6500, image: 'weapon_assaultrifle.png' },
    { name: 'Carbine Rifle', hash: 'weapon_carbinerifle', category: 'Assault Rifles', ammo: 750, price: 7000, image: 'weapon_carbinerifle.png' },
    { name: 'Advanced Rifle', hash: 'weapon_advancedrifle', category: 'Assault Rifles', ammo: 750, price: 7500, image: 'weapon_advancedrifle.png' },
    { name: 'Special Carbine', hash: 'weapon_specialcarbine', category: 'Assault Rifles', ammo: 750, price: 7200, image: 'weapon_specialcarbine.png' },
    { name: 'Bullpup Rifle', hash: 'weapon_bullpuprifle', category: 'Assault Rifles', ammo: 750, price: 6800, image: 'weapon_bullpuprifle.png' },
    { name: 'Compact Rifle', hash: 'weapon_compactrifle', category: 'Assault Rifles', ammo: 750, price: 5500, image: 'weapon_compactrifle.png' },
    { name: 'Military Rifle', hash: 'weapon_militaryrifle', category: 'Assault Rifles', ammo: 750, price: 8500, image: 'weapon_militaryrifle.png' },
    { name: 'Heavy Rifle', hash: 'weapon_heavyrifle', category: 'Assault Rifles', ammo: 750, price: 9000, image: 'weapon_heavyrifle.png' },
    { name: 'Tactical Rifle', hash: 'weapon_tacticalrifle', category: 'Assault Rifles', ammo: 750, price: 8200, image: 'weapon_tacticalrifle.png' },
    { name: 'Assault Rifle Mk II', hash: 'weapon_assaultrifle_mk2', category: 'Assault Rifles', ammo: 750, price: 9500, image: 'weapon_assaultrifle_mk2.png' },
    { name: 'Carbine Rifle Mk II', hash: 'weapon_carbinerifle_mk2', category: 'Assault Rifles', ammo: 750, price: 10000, image: 'weapon_carbinerifle_mk2.png' },
    { name: 'Special Carbine Mk II', hash: 'weapon_specialcarbine_mk2', category: 'Assault Rifles', ammo: 750, price: 9800, image: 'weapon_specialcarbine_mk2.png' },
    { name: 'Bullpup Rifle Mk II', hash: 'weapon_bullpuprifle_mk2', category: 'Assault Rifles', ammo: 750, price: 9200, image: 'weapon_bullpuprifle_mk2.png' },

    // Machine Guns
    { name: 'MG', hash: 'weapon_mg', category: 'Machine Guns', ammo: 1000, price: 10000, image: 'weapon_mg.png' },
    { name: 'Combat MG', hash: 'weapon_combatmg', category: 'Machine Guns', ammo: 1000, price: 12000, image: 'weapon_combatmg.png' },
    { name: 'Gusenberg Sweeper', hash: 'weapon_gusenberg', category: 'Machine Guns', ammo: 1000, price: 11000, image: 'weapon_gusenberg.png' },
    { name: 'Combat MG Mk II', hash: 'weapon_combatmg_mk2', category: 'Machine Guns', ammo: 1000, price: 15000, image: 'weapon_combatmg_mk2.png' },

    // Sniper Rifles
    { name: 'Sniper Rifle', hash: 'weapon_sniperrifle', category: 'Sniper Rifles', ammo: 250, price: 8000, image: 'weapon_sniperrifle.png' },
    { name: 'Heavy Sniper', hash: 'weapon_heavysniper', category: 'Sniper Rifles', ammo: 250, price: 15000, image: 'weapon_heavysniper.png' },
    { name: 'Marksman Rifle', hash: 'weapon_marksmanrifle', category: 'Sniper Rifles', ammo: 250, price: 10000, image: 'weapon_marksmanrifle.png' },
    { name: 'Precision Rifle', hash: 'weapon_precisionrifle', category: 'Sniper Rifles', ammo: 250, price: 12000, image: 'weapon_precisionrifle.png' },
    { name: 'Heavy Sniper Mk II', hash: 'weapon_heavysniper_mk2', category: 'Sniper Rifles', ammo: 250, price: 18000, image: 'weapon_heavysniper_mk2.png' },
    { name: 'Marksman Rifle Mk II', hash: 'weapon_marksmanrifle_mk2', category: 'Sniper Rifles', ammo: 250, price: 13000, image: 'weapon_marksmanrifle_mk2.png' },
    { name: 'Musket', hash: 'weapon_musket', category: 'Shotguns', ammo: 250, price: 1500, image: 'weapon_musket.png' },

    // Heavy Weapons
    { name: 'RPG', hash: 'weapon_rpg', category: 'Heavy Weapons', ammo: 20, price: 25000, image: 'weapon_rpg.png' },
    { name: 'Grenade Launcher', hash: 'weapon_grenadelauncher', category: 'Heavy Weapons', ammo: 20, price: 20000, image: 'weapon_grenadelauncher.png' },
    { name: 'Minigun', hash: 'weapon_minigun', category: 'Heavy Weapons', ammo: 5000, price: 50000, image: 'weapon_minigun.png' },
    { name: 'Firework Launcher', hash: 'weapon_firework', category: 'Heavy Weapons', ammo: 20, price: 5000, image: 'weapon_firework.png' },
    { name: 'Homing Launcher', hash: 'weapon_hominglauncher', category: 'Heavy Weapons', ammo: 20, price: 30000, image: 'weapon_hominglauncher.png' },
    { name: 'Compact Grenade Launcher', hash: 'weapon_compactlauncher', category: 'Heavy Weapons', ammo: 20, price: 18000, image: 'weapon_compactlauncher.png' },
    { name: 'Widowmaker', hash: 'weapon_rayminigun', category: 'Heavy Weapons', ammo: 5000, price: 60000, image: 'weapon_rayminigun.png' },
    { name: 'Railgun', hash: 'weapon_railgun', category: 'Heavy Weapons', ammo: 20, price: 35000, image: 'weapon_railgun.png' },
    { name: 'Compact EMP Launcher', hash: 'weapon_emplauncher', category: 'Heavy Weapons', ammo: 20, price: 22000, image: 'weapon_emplauncher.png' },
    { name: 'Railgun', hash: 'weapon_railgunxm3', category: 'Heavy Weapons', ammo: 20, price: 40000, image: 'weapon_railgunxm3.png' },
    { name: 'Grenade Launcher Smoke', hash: 'weapon_grenadelauncher_smoke', category: 'Heavy Weapons', ammo: 20, price: 15000, image: 'weapon_grenadelauncher_smoke.png' },

    // Throwables
    { name: 'Grenade', hash: 'weapon_grenade', category: 'Throwables', ammo: 25, price: 500, image: 'weapon_grenade.png' },
    { name: 'Sticky Bomb', hash: 'weapon_stickybomb', category: 'Throwables', ammo: 25, price: 800, image: 'weapon_stickybomb.png' },
    { name: 'Proximity Mine', hash: 'weapon_proxmine', category: 'Throwables', ammo: 25, price: 1000, image: 'weapon_proxmine.png' },
    { name: 'BZ Gas', hash: 'weapon_bzgas', category: 'Throwables', ammo: 25, price: 600, image: 'weapon_bzgas.png' },
    { name: 'Molotov', hash: 'weapon_molotov', category: 'Throwables', ammo: 25, price: 300, image: 'weapon_molotov.png' },
    { name: 'Flare', hash: 'weapon_flare', category: 'Throwables', ammo: 25, price: 100, image: 'weapon_flare.png' },
    { name: 'Pipe Bomb', hash: 'weapon_pipebomb', category: 'Throwables', ammo: 25, price: 700, image: 'weapon_pipebomb.png' },
    { name: 'Snowball', hash: 'weapon_snowball', category: 'Throwables', ammo: 25, price: 10, image: 'weapon_snowball.png' },
    { name: 'Ball', hash: 'weapon_ball', category: 'Throwables', ammo: 25, price: 5, image: 'weapon_ball.png' },
    { name: 'Smoke Grenade', hash: 'weapon_smokegrenade', category: 'Throwables', ammo: 25, price: 200, image: 'weapon_smokegrenade.png' },
    { name: 'Tear Gas', hash: 'weapon_teargas', category: 'Throwables', ammo: 25, price: 400, image: 'weapon_teargas.png' },

    // Misc
    { name: 'Jerry Can', hash: 'weapon_petrolcan', category: 'Misc', ammo: 1000, price: 50, image: 'weapon_petrolcan.png' },
    { name: 'Fire Extinguisher', hash: 'weapon_fireextinguisher', category: 'Misc', ammo: 1000, price: 100, image: 'weapon_fireextinguisher.png' },
    { name: 'Parachute', hash: 'gadget_parachute', category: 'Misc', ammo: 0, price: 200, image: 'gadget_parachute.png' },
    { name: 'Hazardous Jerry Can', hash: 'weapon_hazardcan', category: 'Misc', ammo: 1000, price: 75, image: 'weapon_hazardcan.png' },
    { name: 'Fertilizer Can', hash: 'weapon_fertilizercan', category: 'Misc', ammo: 1000, price: 80, image: 'weapon_fertilizercan.png' },
];
