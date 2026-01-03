import * as alt from 'alt-client';
import * as native from 'natives';
import { useRebarClient } from '../../../main/client/index.js';
import { FlyModeEvents } from '../shared/events.js';

const Rebar = useRebarClient();

// Fly mode state
let isFlyModeActive = false;
let flySpeed = 1.0; // Default speed multiplier
let flyInterval: number | null = null;

// Speed settings
const MIN_SPEED = 0.1;
const MAX_SPEED = 10.0;
const SPEED_INCREMENT = 0.2;

// Control keys
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_SPACE = 32;
const KEY_SHIFT = 16;
const KEY_F10 = 121;

// Camera controls
const CONTROL_MOVE_LR = 30;
const CONTROL_MOVE_UD = 31;

// Mouse wheel controls
const CONTROL_SCROLL_UP = 241;
const CONTROL_SCROLL_DOWN = 242;

/**
 * Main fly mode tick function
 * Handles player movement in fly mode
 */
function flyModeTick() {
    if (!isFlyModeActive) {
        return;
    }

    const player = alt.Player.local;
    
    // Disable collision for smooth movement
    native.setEntityCollision(player.scriptID, false, false);
    
    // Get camera direction
    const camRot = native.getGameplayCamRot(2);
    const camPos = native.getGameplayCamCoord();
    
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
    let pos = player.pos;
    let newPos = { x: pos.x, y: pos.y, z: pos.z };
    
    // Calculate speed based on current multiplier
    const baseSpeed = 0.5;
    const currentSpeed = baseSpeed * flySpeed;
    
    // Forward/Backward movement (W/S)
    if (native.isDisabledControlPressed(0, CONTROL_MOVE_UD)) {
        const moveValue = native.getDisabledControlNormal(0, CONTROL_MOVE_UD);
        newPos.x -= forward.x * moveValue * currentSpeed;
        newPos.y -= forward.y * moveValue * currentSpeed;
        newPos.z -= forward.z * moveValue * currentSpeed;
    }
    
    // Left/Right movement (A/D)
    if (native.isDisabledControlPressed(0, CONTROL_MOVE_LR)) {
        const moveValue = native.getDisabledControlNormal(0, CONTROL_MOVE_LR);
        newPos.x += right.x * moveValue * currentSpeed;
        newPos.y += right.y * moveValue * currentSpeed;
    }
    
    // Up movement (Space)
    if (alt.isKeyDown(KEY_SPACE)) {
        newPos.z += currentSpeed;
    }
    
    // Down movement (Shift)
    if (alt.isKeyDown(KEY_SHIFT)) {
        newPos.z -= currentSpeed;
    }
    
    // Apply new position
    native.setEntityCoordsNoOffset(player.scriptID, newPos.x, newPos.y, newPos.z, false, false, false);
    
    // Freeze player to prevent falling
    native.freezeEntityPosition(player.scriptID, true);
    
    // Keep player invisible to prevent animation issues
    native.setEntityAlpha(player.scriptID, 0, false);
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
    
    // Disable collision
    native.setEntityCollision(player.scriptID, false, false);
    
    // Make player invisible
    native.setEntityAlpha(player.scriptID, 0, false);
    
    // Freeze player
    native.freezeEntityPosition(player.scriptID, true);
    
    // Start fly mode tick
    if (flyInterval === null) {
        flyInterval = alt.everyTick(flyModeTick);
    }
    
    console.log('[Fly Mode] Enabled - Speed:', flySpeed);
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
    
    // Re-enable collision
    native.setEntityCollision(player.scriptID, true, true);
    
    // Make player visible again
    native.resetEntityAlpha(player.scriptID);
    
    // Unfreeze player
    native.freezeEntityPosition(player.scriptID, false);
    
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
    flySpeed = Math.round(flySpeed * 10) / 10; // Round to 1 decimal
    
    console.log('[Fly Mode] Speed increased to:', flySpeed);
    
    // Show notification
    alt.emit('rebar:showNotification', `Fly speed: ${flySpeed.toFixed(1)}x`);
}

/**
 * Decrease fly speed
 */
function decreaseFlySpeed() {
    flySpeed = Math.max(flySpeed - SPEED_INCREMENT, MIN_SPEED);
    flySpeed = Math.round(flySpeed * 10) / 10; // Round to 1 decimal
    
    console.log('[Fly Mode] Speed decreased to:', flySpeed);
    
    // Show notification
    alt.emit('rebar:showNotification', `Fly speed: ${flySpeed.toFixed(1)}x`);
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

/**
 * Handle mouse wheel for speed control (only when flying)
 */
alt.everyTick(() => {
    if (!isFlyModeActive) {
        return;
    }
    
    // Scroll up - increase speed
    if (native.isDisabledControlJustPressed(0, CONTROL_SCROLL_UP)) {
        increaseFlySpeed();
    }
    
    // Scroll down - decrease speed
    if (native.isDisabledControlJustPressed(0, CONTROL_SCROLL_DOWN)) {
        decreaseFlySpeed();
    }
});

// Register server events
alt.onServer(FlyModeEvents.toClient.setFlyMode, handleSetFlyMode);

// Cleanup on disconnect
alt.on('disconnect', () => {
    disableFlyMode();
});
