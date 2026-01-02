# Weapon Menu Plugin

A comprehensive weapon menu plugin for alt:V Rebar framework with favorites system and search functionality.

## Features

- ✅ Complete GTA V weapon list (85+ weapons)
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
- **Click** on a weapon to equip it
- **Click** on the star icon to add/remove from favorites
- **ESC** to close the menu
- **Search bar** to filter weapons
- **Tab** buttons to switch between all weapons and favorites

## Installation

The plugin is automatically loaded when placed in the `src/plugins/` directory.

## Architecture

```
weapon-menu/
├── client/         # Client-side logic (webview control, key handlers)
├── server/         # Server-side logic (commands, weapon giving, favorites)
├── shared/         # Shared data (events, config, weapon list)
└── webview/        # Vue 3 UI component
```

## Configuration

Edit `shared/config.ts` to customize:
- UI position and size
- Keybindings
- Display limits

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
- Game controls are disabled while menu is open
