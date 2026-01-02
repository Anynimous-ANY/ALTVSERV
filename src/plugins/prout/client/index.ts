import * as alt from 'alt-client';
import * as native from 'natives';
import { useRebarClient } from '../../../main/client/index.js';
import { FlyEvents } from '../shared/flyEvents.js';

const Rebar = useRebarClient();

let isFlyEnabled = false;
let flySpeed = 1.0;
const baseFlySpeed = 0.5;
const maxFlySpeed = 5.0;
const minFlySpeed = 0.1;

let interval: number | undefined;

function startFlyMode() {
    if (interval !== undefined) {
        return;
    }

    const player = alt.Player.local;
    const ped = player.scriptID;
    
    // Enable fly mode settings without changing collision (to prevent model change)
    native.setEntityInvincible(ped, true);
    native.setPedCanRagdoll(ped, false);
    native.setEntityProofs(ped, true, true, true, true, true, true, true, true);
    
    interval = alt.setInterval(() => {
        if (!isFlyEnabled) {
            return;
        }

        const pos = player.pos;
        const rot = native.getGameplayCamRot(2);

        // Prevent falling and make noclip-like by resetting velocity
        native.setEntityVelocity(ped, 0, 0, 0);
        native.setEntityHasGravity(ped, false);

        // Calculate movement direction
        let velocity = new alt.Vector3(0, 0, 0);

        // Forward/Backward (W/S)
        if (native.isControlPressed(0, 32)) { // W
            const radZ = (rot.z * Math.PI) / 180;
            const radX = (rot.x * Math.PI) / 180;
            velocity.x += -Math.sin(radZ) * Math.cos(radX) * flySpeed;
            velocity.y += Math.cos(radZ) * Math.cos(radX) * flySpeed;
            velocity.z += Math.sin(radX) * flySpeed;
        }
        if (native.isControlPressed(0, 33)) { // S
            const radZ = (rot.z * Math.PI) / 180;
            const radX = (rot.x * Math.PI) / 180;
            velocity.x -= -Math.sin(radZ) * Math.cos(radX) * flySpeed;
            velocity.y -= Math.cos(radZ) * Math.cos(radX) * flySpeed;
            velocity.z -= Math.sin(radX) * flySpeed;
        }

        // Left/Right (A/D)
        if (native.isControlPressed(0, 34)) { // A
            const radZ = ((rot.z - 90) * Math.PI) / 180;
            velocity.x += -Math.sin(radZ) * flySpeed;
            velocity.y += Math.cos(radZ) * flySpeed;
        }
        if (native.isControlPressed(0, 35)) { // D
            const radZ = ((rot.z + 90) * Math.PI) / 180;
            velocity.x += -Math.sin(radZ) * flySpeed;
            velocity.y += Math.cos(radZ) * flySpeed;
        }

        // Up/Down (Space/Shift)
        if (native.isControlPressed(0, 22)) { // Space
            velocity.z += flySpeed;
        }
        if (native.isControlPressed(0, 36)) { // Left Shift
            velocity.z -= flySpeed;
        }

        // Speed adjustment (Mouse Wheel)
        if (native.isControlPressed(0, 241)) { // Mouse Wheel Up
            flySpeed = Math.min(flySpeed + 0.1, maxFlySpeed);
        }
        if (native.isControlPressed(0, 242)) { // Mouse Wheel Down
            flySpeed = Math.max(flySpeed - 0.1, minFlySpeed);
        }

        // Apply movement
        if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {
            const newPos = new alt.Vector3(
                pos.x + velocity.x,
                pos.y + velocity.y,
                pos.z + velocity.z
            );

            native.setEntityCoordsNoOffset(ped, newPos.x, newPos.y, newPos.z, false, false, false);
        }
    }, 0);
}

function stopFlyMode() {
    if (interval === undefined) {
        return;
    }

    alt.clearInterval(interval);
    interval = undefined;

    const player = alt.Player.local;
    const ped = player.scriptID;

    // Re-enable normal physics
    native.setEntityInvincible(ped, false);
    native.setPedCanRagdoll(ped, true);
    native.setEntityProofs(ped, false, false, false, false, false, false, false, false);
    native.setEntityHasGravity(ped, true);
}

function toggleFly(enabled: boolean) {
    isFlyEnabled = enabled;
    flySpeed = baseFlySpeed;

    if (isFlyEnabled) {
        startFlyMode();
    } else {
        stopFlyMode();
    }
}

alt.onServer(FlyEvents.toClient.toggle, toggleFly);
