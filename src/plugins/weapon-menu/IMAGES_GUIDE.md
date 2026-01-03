# How to Add Weapon Images

This guide explains how to add custom images for weapons in the weapon menu.

## Image Requirements

- **Format**: PNG, JPG, SVG, or WEBP
- **Recommended Size**: 100x100px or higher
- **Naming**: Must match the weapon hash (e.g., `weapon_pistol.png` for the Pistol)

## Adding Images

1. Place your weapon images in the `src/plugins/weapon-menu/images/` directory
2. Name each file according to the weapon's hash from `shared/weapons.ts`
3. The build system will automatically copy images to the webview

### Example File Structure

```
src/plugins/weapon-menu/images/
├── placeholder.svg           # Default fallback image
├── weapon_pistol.png         # Pistol image
├── weapon_combatpistol.png   # Combat Pistol image
├── weapon_microsmg.png       # Micro SMG image
└── ... (more weapon images)
```

## Automatic Fallback

If a weapon image is missing, the system will automatically use `placeholder.svg` as a fallback image.

## Finding Weapon Hashes

Weapon hashes are defined in `src/plugins/weapon-menu/shared/weapons.ts`. Look for the `hash` property of each weapon.

Example:
```typescript
{ name: 'Pistol', hash: 'weapon_pistol', category: 'Handguns', ... }
```

The image should be named `weapon_pistol.png` (or .jpg, .svg, .webp).

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
