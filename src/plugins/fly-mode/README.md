# Fly Mode Plugin

A fly/noclip plugin for alt:V servers using ReBar framework. Allows admin users to fly around the map with adjustable speed.

## Features

- ✈️ **Fly Mode (Noclip)**: Disable collision and fly freely through the map
- ⌨️ **F10 Toggle**: Quick toggle fly mode on/off with F10 key
- 🎮 **Command Support**: `/fly` command for toggling fly mode
- 🔧 **Speed Control**: Adjust fly speed with mouse wheel (scroll up/down)
- 🚗 **Vehicle Support**: Fly while in vehicles and keep vehicle when disabling fly mode
- 👤 **Visible Character**: Character remains visible with Superman-like flying pose
- 🔐 **Admin Only**: Requires admin permission to use

## Usage

### Commands

- `/fly` - Toggle fly mode on/off (requires admin permission)

### Keybinds (AZERTY Layout)

- **F10** - Toggle fly mode on/off
- **Z/Q/S/D** - Move forward/left/backward/right (AZERTY layout)
- **Shift** - Move up
- **Ctrl** - Move down
- **Mouse Wheel Up** - Increase fly speed
- **Mouse Wheel Down** - Decrease fly speed

### Speed Control

- Default speed: 0.5x
- Minimum speed: 0.05x (very slow)
- Maximum speed: 5.0x (fast)
- Speed increment: 0.1x per scroll
- Range includes: 0.05, 0.15, 0.25, 0.35, 0.45, 0.5 (default), 0.6, 0.7, 0.8, 0.9, 1.0, ..., up to 5.0x

### Vehicle Flying

You can activate fly mode while in a vehicle. The vehicle will fly with you and remain with you when you disable fly mode.

### Chat Protection

Movement controls are automatically disabled when the chat or console is open, preventing accidental movement when typing commands like `/fly`.

## Installation

This plugin is already integrated into the ReBar plugin system. No additional installation required.

## Permissions

Requires `admin` permission to use fly mode.

To grant admin permission on localhost:
1. Use `/setadmin` command in-game (only works on localhost)
2. Or manually grant permission via database/account system

## Technical Details

### Files Structure

```
src/plugins/fly-mode/
├── client/
│   └── index.ts       # Client-side fly logic
├── server/
│   └── index.ts       # Server-side command and event handlers
└── shared/
    └── events.ts      # Shared event definitions
```

### Events

#### Client → Server
- `flymode:toggleFly` - Request fly mode toggle
- `flymode:updateSpeed` - Notify speed change

#### Server → Client
- `flymode:setFlyMode` - Enable/disable fly mode
- `flymode:updateSpeed` - Update speed value

## Features

### AZERTY Keyboard Layout
The plugin uses AZERTY keyboard layout:
- Z: Forward
- S: Backward
- Q: Left
- D: Right
- Shift: Up
- Ctrl: Down

### Character Visibility
Your character remains visible while flying and will be positioned in a Superman-like flying pose.

### Vehicle Support
You can fly in vehicles! When you enable fly mode while in a vehicle, the vehicle will fly with you. When you disable fly mode, you'll keep the vehicle and remain seated inside.

### Mouse Wheel Speed Control
The mouse wheel is dedicated to speed control when in fly mode. The weapon wheel is disabled to prevent conflicts.

## Troubleshooting

### Player not moving while flying
- Make sure you're using ZQSD keys for AZERTY layout
- Check that fly mode is actually enabled (you should see a notification)
- Try toggling fly mode off and on again

### F10 not working
- Make sure you have admin permission
- Check console for any errors
- Ensure no other plugin is using F10 key

### Mouse wheel not changing speed
- Make sure fly mode is active
- Try scrolling slowly
- Check console for speed change messages

## Credits

Created for ALTVSERV ReBar implementation.
