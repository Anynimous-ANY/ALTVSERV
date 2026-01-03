# Weapon Menu Plugin

A comprehensive weapon menu plugin for alt:V Rebar framework with favorites system, pricing, and weapon images.

## Features

- ✅ Complete GTA V weapon list (85+ weapons)
- ✅ **Weapon pricing system** integrated with money plugin
- ✅ **Weapon images** displayed for all weapons
- ✅ **Movement enabled** - walk, run, and drive while menu is open
- ✅ **Camera locked** - prevents camera rotation while browsing
- ✅ Search functionality with debouncing
- ✅ Favorites system (up to 20 weapons)
- ✅ Categorized weapon display
- ✅ Modern UI with TailwindCSS
- ✅ Rounded square container positioned at left-center
- ✅ Full accessibility support (ARIA labels, keyboard navigation)
- ✅ Error handling and validation
- ✅ Responsive and smooth animations

## Usage

### Command
```
/weapons - Opens the weapon menu
```

### Controls
- **Click** on a weapon to buy it (requires money)
- **Click** on the star icon to add/remove from favorites
- **ESC** to close the menu
- **Search bar** to filter weapons
- **Tab** buttons to switch between all weapons, favorites, and modify tabs
- **Move** with WASD/arrow keys while menu is open
- **Drive** vehicles while menu is open

## Weapon Pricing

Each weapon has a specific price based on its category and power:
- **Melee weapons**: 0€ - 300€
- **Handguns**: 300€ - 2,500€
- **SMGs**: 1,800€ - 5,000€
- **Shotguns**: 2,500€ - 6,000€
- **Assault Rifles**: 5,500€ - 10,000€
- **Machine Guns**: 10,000€ - 15,000€
- **Sniper Rifles**: 8,000€ - 18,000€
- **Heavy Weapons**: 5,000€ - 60,000€
- **Throwables**: 5€ - 1,000€
- **Misc items**: 50€ - 200€

The system checks your balance before purchase and shows appropriate notifications.

## Weapon Images

Each weapon displays an image:
- Images are stored in `src/plugins/weapon-menu/images/`
- Named according to weapon hash (e.g., `weapon_pistol.png`)
- Fallback to placeholder image if weapon image is missing
- Displayed in weapon list, favorites, and modification tabs

## Installation

The plugin is automatically loaded when placed in the `src/plugins/` directory.

## Architecture

```
weapon-menu/
├── client/         # Client-side logic (webview control, key handlers, movement controls)
├── server/         # Server-side logic (commands, weapon giving, favorites, pricing)
├── shared/         # Shared data (events, config, weapon list with prices)
├── webview/        # Vue 3 UI component with images
└── images/         # Weapon images (PNG/SVG)
```

## Configuration

Edit `shared/config.ts` to customize:
- UI position and size
- Keybindings
- Display limits

## Adding Weapon Images

1. Place weapon images in `src/plugins/weapon-menu/images/`
2. Name files according to weapon hash (e.g., `weapon_pistol.png`)
3. Supported formats: PNG, JPG, SVG, WEBP
4. Recommended size: 100x100px or higher
5. Images are automatically copied to webview during build

## Weapon Categories

- Melee
- Handguns
- SMGs
- Shotguns
- Assault Rifles
- Machine Guns
- Sniper Rifles
- Heavy Weapons
- Throwables
- Misc

## Security Features

- ✅ Input validation on all events
- ✅ Weapon hash verification
- ✅ Character existence checks
- ✅ Callback error handling
- ✅ Try-catch blocks on all critical paths
- ✅ Favorites limit (20 weapons max)

## Performance Optimizations

- ✅ Debounced search (300ms)
- ✅ Computed properties for filtering
- ✅ Event listener cleanup
- ✅ Proper memory management
- ✅ Optimized re-renders

## Notes

- Favorites are saved per character
- Ammo amounts vary by weapon type
- Menu closes automatically when pressing ESC
- **Movement is enabled** - you can walk, run, and drive while the menu is open
- **Camera is locked** - prevents accidental camera rotation while browsing
- **Weapons cost money** - prices vary by weapon type and power
- Money is deducted automatically on purchase
- Insufficient funds will show an error notification
- Game attack controls are disabled while menu is open
