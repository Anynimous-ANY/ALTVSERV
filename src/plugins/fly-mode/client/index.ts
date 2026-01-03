import * as alt from 'alt-client';
import * as native from 'natives';
import { FlyModeEvents } from '../shared/events.js';

// Fly mode state
let isFlyModeActive = false;
let flySpeed = 2.0; // Default speed multiplier (increased from 1.0)
let flyInterval: number | null = null;
let savedVehicle: number | null = null; // Store vehicle ID when flying in vehicle

// Speed settings
const MIN_SPEED = 0.5;
const MAX_SPEED = 50.0; // Increased from 10.0 for much faster speeds
const SPEED_INCREMENT = 1.0; // Increased from 0.2 for faster speed changes

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
const CONTROL_SCROLL_UP_ALTERNATE = 241; // Alternative scroll up
const CONTROL_SCROLL_DOWN_ALTERNATE = 242; // Alternative scroll down

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
    
    // Disable weapon wheel controls when in fly mode
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_NEXT, true);
    native.disableControlAction(0, CONTROL_WEAPON_WHEEL_PREV, true);
    
    // Handle mouse wheel for speed control
    if (
        native.isControlJustPressed(0, CONTROL_WEAPON_WHEEL_NEXT) ||
        native.isControlJustPressed(0, CONTROL_SCROLL_UP_ALTERNATE)
    ) {
        increaseFlySpeed();
    }
    if (
        native.isControlJustPressed(0, CONTROL_WEAPON_WHEEL_PREV) ||
        native.isControlJustPressed(0, CONTROL_SCROLL_DOWN_ALTERNATE)
    ) {
        decreaseFlySpeed();
    }
    
    // Check if player is in a vehicle
    const vehicle = player.vehicle;
    const entityToMove = vehicle ? vehicle.scriptID : player.scriptID;
    
    if (!vehicle) {
        // Freeze player to prevent falling (only if not in vehicle)
        native.freezeEntityPosition(player.scriptID, true);
        
        // Set Superman flying animation for player
        if (!native.isEntityPlayingAnim(player.scriptID, 'move_crouch_proto', 'idle_intro', 3)) {
            native.requestAnimDict('move_crouch_proto');
            let timeout = 0;
            const animInterval = alt.setInterval(() => {
                if (native.hasAnimDictLoaded('move_crouch_proto') || timeout > 100) {
                    alt.clearInterval(animInterval);
                    if (native.hasAnimDictLoaded('move_crouch_proto')) {
                        // Play animation that looks like Superman pose
                        native.taskPlayAnim(player.scriptID, 'move_crouch_proto', 'idle_intro', 8.0, -8.0, -1, 1, 0, false, false, false);
                    }
                }
                timeout++;
            }, 10);
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
    
    // Calculate speed based on current multiplier (increased base speed)
    const baseSpeed = 2.0; // Increased from 0.5
    const currentSpeed = baseSpeed * flySpeed;
    
    // Forward/Backward movement (Z/S for AZERTY)
    if (alt.isKeyDown(KEY_Z)) {
        newPos.x += forward.x * currentSpeed;
        newPos.y += forward.y * currentSpeed;
        newPos.z += forward.z * currentSpeed;
    }
    if (alt.isKeyDown(KEY_S)) {
        newPos.x -= forward.x * currentSpeed;
        newPos.y -= forward.y * currentSpeed;
        newPos.z -= forward.z * currentSpeed;
    }
    
    // Left/Right movement (Q/D for AZERTY)
    if (alt.isKeyDown(KEY_Q)) {
        newPos.x -= right.x * currentSpeed;
        newPos.y -= right.y * currentSpeed;
    }
    if (alt.isKeyDown(KEY_D)) {
        newPos.x += right.x * currentSpeed;
        newPos.y += right.y * currentSpeed;
    }
    
    // Up movement (Shift)
    if (alt.isKeyDown(KEY_SHIFT)) {
        newPos.z += currentSpeed;
    }
    
    // Down movement (Ctrl)
    if (alt.isKeyDown(KEY_CTRL)) {
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
        // Store vehicle reference
        savedVehicle = vehicle.scriptID;
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
    
    // Reset saved vehicle
    savedVehicle = null;
    
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
 */
alt.on('keyup', (key: number) => {
    // F10 key - Toggle fly mode
    if (key === KEY_F10) {
        alt.emitServer(FlyModeEvents.toServer.toggleFly);
    }
});

// Register server events
alt.onServer(FlyModeEvents.toClient.setFlyMode, handleSetFlyMode);

// Cleanup on disconnect
alt.on('disconnect', () => {
    disableFlyMode();
});
