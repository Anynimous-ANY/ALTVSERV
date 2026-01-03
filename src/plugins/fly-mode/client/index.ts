import * as alt from 'alt-client';
import * as native from 'natives';
import { FlyModeEvents } from '../shared/events.js';

// Fly mode state
let isFlyModeActive = false;
let flySpeed = 0.5; // Default speed multiplier - medium speed
let flyInterval: number | null = null;
let lastF10Press = 0; // Debounce for F10 key

// Speed settings - expanded range for more control
const MIN_SPEED = 0.05; // Very slow minimum
const MAX_SPEED = 5.0; // Fast maximum
const SPEED_INCREMENT = 0.1; // Fine increment for precise control
const F10_DEBOUNCE_MS = 500; // Debounce time for F10 to prevent double triggers

// Control keys (AZERTY layout)
const KEY_Z = 90; // Forward (was W)
const KEY_S = 83; // Backward
const KEY_Q = 81; // Left (was A)
const KEY_D = 68; // Right
const KEY_SHIFT = 16; // Up (was Space)
const KEY_CTRL = 17; // Down (was Shift)
const KEY_F10 = 121;

// Mouse wheel control IDs
const CONTROL_WEAPON_WHEEL_NEXT = 14; // Scroll up
const CONTROL_WEAPON_WHEEL_PREV = 15; // Scroll down
const CONTROL_SELECT_NEXT_WEAPON = 16; // Select next weapon
const CONTROL_SELECT_PREV_WEAPON = 17; // Select prev weapon
const CONTROL_SELECT_WEAPON = 37; // Select weapon (tab)
const CONTROL_WEAPON_WHEEL_UP = 157; // Weapon wheel up
const CONTROL_WEAPON_WHEEL_DOWN = 158; // Weapon wheel down
const CONTROL_WEAPON_WHEEL_LEFT = 159; // Weapon wheel left
const CONTROL_WEAPON_WHEEL_RIGHT = 160; // Weapon wheel right
const CONTROL_WEAPON_WHEEL_261 = 261; // Weapon wheel control
const CONTROL_WEAPON_WHEEL_262 = 262; // Weapon wheel control
const CONTROL_SCROLL_UP_ALTERNATE = 241; // Alternative scroll up
const CONTROL_SCROLL_DOWN_ALTERNATE = 242; // Alternative scroll down

// Animation settings
const MAX_ANIM_LOAD_ATTEMPTS = 100; // Maximum attempts to load animation dictionary

/**
 * Round fly speed to 1 decimal place
 */
function roundSpeed(speed: number): number {
    return Math.round(speed * 10) / 10;
}

/**
 * Main fly mode tick function
 * Handles player movement in fly mode
 */
function flyModeTick() {
    if (!isFlyModeActive) {
        return;
    }

    const player = alt.Player.local;
    
    // Disable weapon wheel controls when in fly mode - all control IDs to ensure it's fully disabled
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_NEXT, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_PREV, true);
    native.disableControlAction(0, CONTROL_SELECT_NEXT_WEAPON, true);
    native.disableControlAction(0, CONTROL_SELECT_PREV_WEAPON, true);
    native.disableControlAction(0, CONTROL_SELECT_WEAPON, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_UP, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_DOWN, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_LEFT, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_RIGHT, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_261, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_262, true);
    
    // Handle mouse wheel for speed control
    if (
        native.isDisabledControlJustPressed(0, CONTROL_WEAPON_WHEEL_NEXT) ||
        native.isDisabledControlJustPressed(0, CONTROL_SCROLL_UP_ALTERNATE)
    ) {
        increaseFlySpeed();
    }
    if (
        native.isDisabledControlJustPressed(0, CONTROL_WEAPON_WHEEL_PREV) ||
        native.isDisabledControlJustPressed(0, CONTROL_SCROLL_DOWN_ALTERNATE)
    ) {
        decreaseFlySpeed();
    }
    
    // Check if player is in a vehicle
    const vehicle = player.vehicle;
    const entityToMove = vehicle ? vehicle.scriptID : player.scriptID;
    
    if (!vehicle) {
        // Freeze player to prevent falling (only if not in vehicle)
        native.freezeEntityPosition(player.scriptID, true);
        
        // Set Superman flying animation - use fallskydive animation for better Superman pose
        const animDict = 'move_strafe@stealth';
        const animName = 'idle';
        
        // Force the animation every frame to ensure it stays active
        if (!native.isEntityPlayingAnim(player.scriptID, animDict, animName, 3)) {
            if (!native.hasAnimDictLoaded(animDict)) {
                native.requestAnimDict(animDict);
            } else {
                // Play animation with flags that keep it active
                // Flag 1 = repeat, no interruption
                native.taskPlayAnim(player.scriptID, animDict, animName, 8.0, -8.0, -1, 1, 0, false, false, false);
            }
        }
    } else {
        // Freeze vehicle when flying
        native.freezeEntityPosition(vehicle.scriptID, true);
    }
    
    // Get camera direction
    const camRot = native.getGameplayCamRot(2);
    
    // Calculate forward direction from camera
    const rotZ = (camRot.z * Math.PI) / 180;
    const rotX = (camRot.x * Math.PI) / 180;
    
    const forward = {
        x: -Math.sin(rotZ) * Math.abs(Math.cos(rotX)),
        y: Math.cos(rotZ) * Math.abs(Math.cos(rotX)),
        z: Math.sin(rotX),
    };
    
    // Calculate right direction (perpendicular to forward)
    const right = {
        x: Math.cos(rotZ),
        y: Math.sin(rotZ),
        z: 0,
    };
    
    // Get current position
    let pos = vehicle ? vehicle.pos : player.pos;
    let newPos = { x: pos.x, y: pos.y, z: pos.z };
    
    // Calculate speed based on current multiplier
    const baseSpeed = 1.0;
    const currentSpeed = baseSpeed * flySpeed;
    
    // Better chat detection - disable ALL game controls when chat is open
    // This prevents ANY key presses from being processed during chat
    alt.toggleGameControls(!alt.isMenuOpen() && !alt.isConsoleOpen());
    
    // Check if we should process movement (not in menu/chat)
    const canMove = !alt.isMenuOpen() && !alt.isConsoleOpen();
    
    // Forward/Backward movement (Z/S for AZERTY) - only when not in chat
    if (canMove && alt.isKeyDown(KEY_Z)) {
        newPos.x += forward.x * currentSpeed;
        newPos.y += forward.y * currentSpeed;
        newPos.z += forward.z * currentSpeed;
    }
    if (canMove && alt.isKeyDown(KEY_S)) {
        newPos.x -= forward.x * currentSpeed;
        newPos.y -= forward.y * currentSpeed;
        newPos.z -= forward.z * currentSpeed;
    }
    
    // Left/Right movement (Q/D for AZERTY) - straight lateral movement only
    if (canMove && alt.isKeyDown(KEY_Q)) {
        newPos.x -= right.x * currentSpeed;
        newPos.y -= right.y * currentSpeed;
    }
    if (canMove && alt.isKeyDown(KEY_D)) {
        newPos.x += right.x * currentSpeed;
        newPos.y += right.y * currentSpeed;
    }
    
    // Up movement (Shift) - pure vertical
    if (canMove && alt.isKeyDown(KEY_SHIFT)) {
        newPos.z += currentSpeed;
    }
    
    // Down movement (Ctrl) - pure vertical
    if (canMove && alt.isKeyDown(KEY_CTRL)) {
        newPos.z -= currentSpeed;
    }
    
    // Apply new position
    native.setEntityCoordsNoOffset(entityToMove, newPos.x, newPos.y, newPos.z, false, false, false);
}

/**
 * Enable fly mode
 */
function enableFlyMode() {
    if (isFlyModeActive) {
        return;
    }
    
    isFlyModeActive = true;
    const player = alt.Player.local;
    
    // Check if player is in a vehicle
    const vehicle = player.vehicle;
    
    if (vehicle) {
        // Disable collision for vehicle
        native.setEntityCollision(vehicle.scriptID, false, false);
        // Freeze vehicle
        native.freezeEntityPosition(vehicle.scriptID, true);
    } else {
        // Disable collision for player
        native.setEntityCollision(player.scriptID, false, false);
        // Freeze player
        native.freezeEntityPosition(player.scriptID, true);
    }
    
    // Player stays visible - no longer making invisible
    
    // Start fly mode tick
    if (flyInterval === null) {
        flyInterval = alt.everyTick(flyModeTick);
    }
    
    console.log('[Fly Mode] Enabled - Speed:', flySpeed, 'In Vehicle:', vehicle !== null);
}

/**
 * Disable fly mode
 */
function disableFlyMode() {
    if (!isFlyModeActive) {
        return;
    }
    
    isFlyModeActive = false;
    const player = alt.Player.local;
    
    // Check if player was in a vehicle
    const vehicle = player.vehicle;
    
    if (vehicle) {
        // Re-enable collision for vehicle
        native.setEntityCollision(vehicle.scriptID, true, true);
        // Unfreeze vehicle
        native.freezeEntityPosition(vehicle.scriptID, false);
        // Clear animation on player in vehicle
        native.clearPedTasks(player.scriptID);
    } else {
        // Re-enable collision for player
        native.setEntityCollision(player.scriptID, true, true);
        // Unfreeze player
        native.freezeEntityPosition(player.scriptID, false);
        // Clear any animations
        native.clearPedTasks(player.scriptID);
    }
    
    // Stop fly mode tick
    if (flyInterval !== null) {
        alt.clearEveryTick(flyInterval);
        flyInterval = null;
    }
    
    console.log('[Fly Mode] Disabled');
}

/**
 * Handle fly mode toggle from server
 */
function handleSetFlyMode(enabled: boolean) {
    if (enabled) {
        enableFlyMode();
    } else {
        disableFlyMode();
    }
}

/**
 * Increase fly speed
 */
function increaseFlySpeed() {
    flySpeed = Math.min(flySpeed + SPEED_INCREMENT, MAX_SPEED);
    flySpeed = roundSpeed(flySpeed);
    
    console.log('[Fly Mode] Speed increased to:', flySpeed);
    
    // Notify server about speed change
    alt.emitServer(FlyModeEvents.toServer.updateSpeed, flySpeed);
}

/**
 * Decrease fly speed
 */
function decreaseFlySpeed() {
    flySpeed = Math.max(flySpeed - SPEED_INCREMENT, MIN_SPEED);
    flySpeed = roundSpeed(flySpeed);
    
    console.log('[Fly Mode] Speed decreased to:', flySpeed);
    
    // Notify server about speed change
    alt.emitServer(FlyModeEvents.toServer.updateSpeed, flySpeed);
}

/**
 * Handle key press for F10 toggle
 * Simple keydown handler with debounce
 */
alt.on('keydown', (key: number) => {
    // F10 key - Toggle fly mode (keycode 121)
    if (key === KEY_F10) {
        const now = Date.now();
        if (now - lastF10Press > F10_DEBOUNCE_MS) {
            lastF10Press = now;
            console.log('[Fly Mode] F10 pressed, toggling fly mode');
            alt.emitServer(FlyModeEvents.toServer.toggleFly);
        }
    }
});

// Register server events
alt.onServer(FlyModeEvents.toClient.setFlyMode, handleSetFlyMode);

// Cleanup on disconnect
alt.on('disconnect', () => {
    disableFlyMode();
});
