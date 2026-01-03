# ✅ Weapon Images - Already Generated!

## Images Are Ready!

All weapon images have been **automatically generated** and are already in this folder as SVG files. You don't need to download anything manually!

### To Use the Images:

**IMPORTANT**: After pulling this code, you **MUST** run the build command to copy images to the webview:

```bash
node ./scripts/compile.js
```

OR

```bash
pnpm build:docker
```

This command will copy all the weapon images from `src/plugins/weapon-menu/images/` to `webview/public/images/weapons/` where they can be displayed in the game.

## What Images Look Like

Each weapon has a unique, colorful SVG image with:
- Distinct color based on the weapon
- First letter of the weapon name in large text
- Weapon name displayed at bottom
- Professional appearance

Examples:
- `weapon_pistol.svg` - Letter "P" on blue background with "PISTOL" text
- `weapon_knife.svg` - Letter "K" on green background with "KNIFE" text
- `weapon_assaultrifle.svg` - Letter "A" on red background with "ASSAULT RIFLE" text

## Troubleshooting

### Images Not Showing (Paper/Pen Icon)

If you see a paper/pen icon instead of weapon images, it means the images haven't been copied to the webview yet.

**Solution**: Run the build command:
```bash
node ./scripts/compile.js
```

This will copy all SVG images from this folder to `webview/public/images/weapons/`.

### Still Having Issues?

1. Check that images exist in `src/plugins/weapon-menu/images/` (they should - 110+ SVG files)
2. Run `node ./scripts/compile.js` to copy them
3. Restart the server
4. Check that `webview/public/images/weapons/` contains the SVG files

## Technical Details

- **Format**: SVG (Scalable Vector Graphics)
- **Size**: 100x100px
- **Count**: 110 weapons + 1 gadget = 111 total files
- **Colors**: Unique hue for each weapon using golden angle distribution
- **Auto-generated**: Created programmatically, no manual work needed
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
