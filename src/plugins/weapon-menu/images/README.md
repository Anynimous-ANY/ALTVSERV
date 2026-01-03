# IMPORTANT: Adding Weapon Images from rage.mp Wiki

## Quick Guide to Add All Weapon Images

To fix the "buggy images" issue, you need to download weapon images from the official rage.mp wiki and place them in this folder.

### Step-by-Step Instructions:

1. **Visit the Weapons Wiki**: Go to https://wiki.rage.mp/wiki/Weapons

2. **Download Each Weapon Image**:
   - Find the weapon in the table
   - Right-click on the weapon icon/image
   - Select "Save image as..."
   - Save with the correct filename (see list below)

3. **Place Images in This Folder**: 
   - All images should be saved to: `src/plugins/weapon-menu/images/`

4. **Rebuild the Project**: Run `pnpm build:docker` or `node ./scripts/compile.js`

## Required Filenames (Must Match Exactly)

### Melee Weapons
- `weapon_unarmed.png` - Unarmed
- `weapon_knife.png` - Knife
- `weapon_nightstick.png` - Nightstick
- `weapon_hammer.png` - Hammer
- `weapon_bat.png` - Bat
- `weapon_golfclub.png` - Golf Club
- `weapon_crowbar.png` - Crowbar
- `weapon_bottle.png` - Bottle
- `weapon_dagger.png` - Antique Cavalry Dagger
- `weapon_hatchet.png` - Hatchet
- `weapon_knuckle.png` - Knuckle Duster
- `weapon_machete.png` - Machete
- `weapon_flashlight.png` - Flashlight
- `weapon_switchblade.png` - Switchblade
- `weapon_poolcue.png` - Pool Cue
- `weapon_wrench.png` - Wrench
- `weapon_battleaxe.png` - Battle Axe
- `weapon_stone_hatchet.png` - Stone Hatchet

### Handguns
- `weapon_pistol.png` - Pistol
- `weapon_combatpistol.png` - Combat Pistol
- `weapon_appistol.png` - AP Pistol
- `weapon_stungun.png` - Stun Gun
- `weapon_pistol50.png` - Pistol .50
- `weapon_snspistol.png` - SNS Pistol
- `weapon_heavypistol.png` - Heavy Pistol
- `weapon_vintagepistol.png` - Vintage Pistol
- `weapon_flaregun.png` - Flare Gun
- `weapon_marksmanpistol.png` - Marksman Pistol
- `weapon_revolver.png` - Heavy Revolver
- `weapon_doubleaction.png` - Double Action Revolver
- `weapon_raypistol.png` - Up-n-Atomizer
- `weapon_ceramicpistol.png` - Ceramic Pistol
- `weapon_navyrevolver.png` - Navy Revolver
- `weapon_gadgetpistol.png` - Perico Pistol
- `weapon_pistol_mk2.png` - Pistol Mk II
- `weapon_snspistol_mk2.png` - SNS Pistol Mk II
- `weapon_revolver_mk2.png` - Heavy Revolver Mk II

### SMGs
- `weapon_microsmg.png` - Micro SMG
- `weapon_smg.png` - SMG
- `weapon_assaultsmg.png` - Assault SMG
- `weapon_combatpdw.png` - Combat PDW
- `weapon_machinepistol.png` - Machine Pistol
- `weapon_minismg.png` - Mini SMG
- `weapon_raycarbine.png` - Unholy Hellbringer
- `weapon_smg_mk2.png` - SMG Mk II

### Shotguns
- `weapon_pumpshotgun.png` - Pump Shotgun
- `weapon_sawnoffshotgun.png` - Sawed-Off Shotgun
- `weapon_assaultshotgun.png` - Assault Shotgun
- `weapon_bullpupshotgun.png` - Bullpup Shotgun
- `weapon_heavyshotgun.png` - Heavy Shotgun
- `weapon_dbshotgun.png` - Double Barrel Shotgun
- `weapon_autoshotgun.png` - Sweeper Shotgun
- `weapon_pumpshotgun_mk2.png` - Pump Shotgun Mk II
- `weapon_combatshotgun.png` - Combat Shotgun
- `weapon_musket.png` - Musket

### Assault Rifles
- `weapon_assaultrifle.png` - Assault Rifle
- `weapon_carbinerifle.png` - Carbine Rifle
- `weapon_advancedrifle.png` - Advanced Rifle
- `weapon_specialcarbine.png` - Special Carbine
- `weapon_bullpuprifle.png` - Bullpup Rifle
- `weapon_compactrifle.png` - Compact Rifle
- `weapon_militaryrifle.png` - Military Rifle
- `weapon_heavyrifle.png` - Heavy Rifle
- `weapon_tacticalrifle.png` - Tactical Rifle
- `weapon_assaultrifle_mk2.png` - Assault Rifle Mk II
- `weapon_carbinerifle_mk2.png` - Carbine Rifle Mk II
- `weapon_specialcarbine_mk2.png` - Special Carbine Mk II
- `weapon_bullpuprifle_mk2.png` - Bullpup Rifle Mk II

### Machine Guns
- `weapon_mg.png` - MG
- `weapon_combatmg.png` - Combat MG
- `weapon_gusenberg.png` - Gusenberg Sweeper
- `weapon_combatmg_mk2.png` - Combat MG Mk II

### Sniper Rifles
- `weapon_sniperrifle.png` - Sniper Rifle
- `weapon_heavysniper.png` - Heavy Sniper
- `weapon_marksmanrifle.png` - Marksman Rifle
- `weapon_precisionrifle.png` - Precision Rifle
- `weapon_heavysniper_mk2.png` - Heavy Sniper Mk II
- `weapon_marksmanrifle_mk2.png` - Marksman Rifle Mk II

### Heavy Weapons
- `weapon_rpg.png` - RPG
- `weapon_grenadelauncher.png` - Grenade Launcher
- `weapon_minigun.png` - Minigun
- `weapon_firework.png` - Firework Launcher
- `weapon_hominglauncher.png` - Homing Launcher
- `weapon_compactlauncher.png` - Compact Grenade Launcher
- `weapon_rayminigun.png` - Widowmaker
- `weapon_railgun.png` - Railgun
- `weapon_emplauncher.png` - Compact EMP Launcher

### Throwables
- `weapon_grenade.png` - Grenade
- `weapon_stickybomb.png` - Sticky Bomb
- `weapon_proxmine.png` - Proximity Mine
- `weapon_bzgas.png` - BZ Gas
- `weapon_molotov.png` - Molotov
- `weapon_flare.png` - Flare
- `weapon_pipebomb.png` - Pipe Bomb
- `weapon_smokegrenade.png` - Smoke Grenade
- `weapon_teargas.png` - Tear Gas

### Misc
- `weapon_petrolcan.png` - Jerry Can
- `weapon_fireextinguisher.png` - Fire Extinguisher
- `gadget_parachute.png` - Parachute

## Alternative: Bulk Download Script

If you're comfortable with command-line tools, you can create a script to download multiple images at once. However, you'll need to find the exact image URLs from the wiki page.

## After Adding Images

1. Rebuild the project: `pnpm build:docker`
2. Restart the server
3. Open the weapon menu in-game
4. All weapons should now display their correct images

## Need Help?

If images still appear buggy after following these steps:
1. Check that filenames exactly match the list above (case-sensitive)
2. Verify images are in PNG format
3. Make sure you rebuilt the project after adding images
4. Check browser console (F12) for any image loading errors
