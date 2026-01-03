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
