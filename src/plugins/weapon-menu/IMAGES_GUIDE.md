# How to Add Weapon Images

This guide explains how to add custom images for weapons in the weapon menu.

## Quick Start: Using Images from rage.mp Wiki

The easiest way to get weapon images is from the official rage.mp wiki at https://wiki.rage.mp/wiki/Weapons

### Steps to Download Images from Wiki:

1. **Visit the Wiki Page**: Go to https://wiki.rage.mp/wiki/Weapons
2. **Find Your Weapon**: Scroll through the weapons table
3. **Download the Image**: Right-click on the weapon icon and select "Save image as..."
4. **Rename the File**: 
   - The image should be named according to the weapon hash
   - Example: For "Pistol" (hash: `weapon_pistol`), save as `weapon_pistol.png`
5. **Place in Images Folder**: Move the image to `src/plugins/weapon-menu/images/`

### Automated Download (Advanced Users)

If you have wget or curl available, you can download images programmatically:

```bash
# Navigate to the images directory
cd src/plugins/weapon-menu/images/

# Example: Download weapon images (adjust URLs as needed)
wget https://wiki.rage.mp/images/[weapon_name].png
```

## Image Requirements

- **Format**: PNG (preferred), JPG, SVG, or WEBP
- **Recommended Size**: 100x100px or higher (will be resized automatically)
- **Background**: Transparent or dark background works best
- **Naming**: Must match the weapon hash exactly (e.g., `weapon_pistol.png`)

## Adding Images Manually

1. Place your weapon images in the `src/plugins/weapon-menu/images/` directory
2. Name each file according to the weapon's hash from `shared/weapons.ts`
3. The build system will automatically copy images to the webview

### Example File Structure

```
src/plugins/weapon-menu/images/
├── placeholder.svg           # Default fallback image
├── weapon_pistol.png         # Pistol image (from wiki)
├── weapon_combatpistol.png   # Combat Pistol image
├── weapon_microsmg.png       # Micro SMG image
├── weapon_assaultrifle.png   # Assault Rifle image
└── ... (more weapon images)
```

## Weapon Hash Reference

Here are some common weapon hashes for quick reference:

### Handguns
- `weapon_pistol.png` - Pistol
- `weapon_combatpistol.png` - Combat Pistol
- `weapon_appistol.png` - AP Pistol
- `weapon_pistol50.png` - Pistol .50
- `weapon_heavypistol.png` - Heavy Pistol
- `weapon_revolver.png` - Heavy Revolver

### SMGs
- `weapon_microsmg.png` - Micro SMG
- `weapon_smg.png` - SMG
- `weapon_assaultsmg.png` - Assault SMG
- `weapon_combatpdw.png` - Combat PDW

### Shotguns
- `weapon_pumpshotgun.png` - Pump Shotgun
- `weapon_sawnoffshotgun.png` - Sawed-Off Shotgun
- `weapon_assaultshotgun.png` - Assault Shotgun

### Assault Rifles
- `weapon_assaultrifle.png` - Assault Rifle
- `weapon_carbinerifle.png` - Carbine Rifle
- `weapon_advancedrifle.png` - Advanced Rifle
- `weapon_specialcarbine.png` - Special Carbine

### Sniper Rifles
- `weapon_sniperrifle.png` - Sniper Rifle
- `weapon_heavysniper.png` - Heavy Sniper
- `weapon_marksmanrifle.png` - Marksman Rifle

For the complete list of weapon hashes, see `src/plugins/weapon-menu/shared/weapons.ts`.

## Automatic Fallback

If a weapon image is missing, the system will automatically use `placeholder.svg` as a fallback image.

## Build Process

The build system automatically:
1. Scans `src/plugins/**/images/**/*.{png,jpg,svg,webp,gif}`
2. Copies images to `webview/public/images/`
3. Makes them accessible at `/images/weapons/{filename}` in the webview

## Where Images Are Used

Images appear in three locations:
1. **All Weapons Tab** - Shows image next to each weapon in the list
2. **Favorites Tab** - Shows image for favorited weapons
3. **Modify Tab** - Shows large image when modifying a weapon

## Tips

- Use transparent backgrounds for better visual integration
- Keep file sizes reasonable (under 100KB per image) for performance
- Use consistent styling across all weapon images for a cohesive look
- The placeholder.svg provides a good example of size and styling
- Download all images from the wiki at once for consistency

## Troubleshooting

### Image Not Showing
1. Check that the filename exactly matches the weapon hash (case-sensitive)
2. Verify the image is in the correct directory: `src/plugins/weapon-menu/images/`
3. Rebuild the project to copy images to webview
4. Check browser console for image loading errors

### Image Quality Issues
1. Ensure images are at least 100x100px
2. Use PNG format for best quality with transparency
3. Optimize images before adding (use tools like TinyPNG)

### Finding Weapon Hashes
Weapon hashes are defined in `src/plugins/weapon-menu/shared/weapons.ts`. Look for the `hash` property of each weapon.

Example:
```typescript
{ name: 'Pistol', hash: 'weapon_pistol', category: 'Handguns', price: 500, image: 'weapon_pistol.png' }
```

The image should be named `weapon_pistol.png` (or .jpg, .svg, .webp).

## Need Help?

If you're having trouble adding images:
1. Check that the build system is running: `pnpm build:docker`
2. Verify images are copied to `webview/public/images/weapons/`
3. Check the browser console for errors
4. Ensure the image format is supported (PNG, JPG, SVG, WEBP)
