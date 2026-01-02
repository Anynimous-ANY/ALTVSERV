import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { FlyEvents } from '../shared/flyEvents.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();

// Track fly state for each player
const flyState = new Map<number, boolean>();

Messenger.commands.register({
    name: 'test',
    desc: '- Runs a test command',
    callback: async (_player) => {},
});

Messenger.commands.register({
    name: 'adminonlycommand',
    desc: '- Only admins can run this',
    options: { permissions: ['admin'] },
    callback: async (player) => {
        const rPlayer = Rebar.usePlayer(player);
        rPlayer.notify.showNotification('Hello Admin!');
    },
});

Messenger.commands.register({
    name: 'heal',
    desc: '- this heals you',
    options: { permissions: ['admin'] },
    callback: async (player) => {
        player.health = player.maxHealth;
    },
});

Messenger.commands.register({
    name: 'setadmin',
    desc: '- set yourself as admin (only allowed on localhost / dev)',
    callback: async (player) => {
        const ip = player.ip;
        const islocalhost = ip === '127.0.0.1'|| ip === '::1'|| ip === 'localhost';
        const rPlayer = Rebar.usePlayer(player);
        if (!islocalhost) {
            rPlayer.notify.showNotification('You can only use this command on localhost / dev servers.');
            return;
        } else {
            const granted = await Rebar.document.account.useAccount(player).permissions.grant('admin');
            rPlayer.notify.showNotification('You are now an admin!');
        }
    },
});

Messenger.commands.register({
    name: 'revive',
    desc: '- this revive you',
    options: { permissions: ['admin'] },
    callback: async (player) => {
      const rPlayer = Rebar.usePlayer(player);
      const character = rPlayer.character.get();
      if (!character) {
          return;
      }
      let isdead = true;
      if (player.health > 100) {
          isdead = false;
          return;
      }
      let spawnpos : alt.Vector3;
      spawnpos = new alt.Vector3(player.pos.x, player.pos.y, player.pos.z + 1);
      player.spawn(spawnpos);
      player.pos = spawnpos;
      player.health = player.maxHealth;
      player.frozen = false;
      const native = Rebar.player.useNative(player);
      native.invoke('clearPedTasksImmediately',player);
      player.clearBloodDamage();
    },
});

Messenger.commands.register({
    name: '100M',
    desc: '- this tp you 100M up',
    options: { permissions: ['admin'] },
    callback: async (player) => {
    let spawnpos : alt.Vector3;
    spawnpos = new alt.Vector3(player.pos.x, player.pos.y, player.pos.z + 100);
    player.spawn(spawnpos);
    player.pos = spawnpos;
    },
});

Messenger.commands.register({
    name: 'veh',
    desc: '- this spawns a vehicle',
    options: { permissions: ['admin'] },
    callback: async (player, model) => {
    const vehicle = new alt.Vehicle(model, player.pos, player.rot);
    player.setIntoVehicle(vehicle,1);
    },
});

Messenger.commands.register({
    name: 'clearveh',
    desc: '- this clears nearby vehicles',
    options: { permissions: ['admin'] },
    callback: async (player,distance) => {
        alt.Vehicle.all.forEach((vehicle) => {
            if (vehicle.engineHealth === 0){
                vehicle.destroy();
                return;
            }
    });
        },
});

Messenger.commands.register({
    name: 'fly',
    desc: '- toggle fly mode (noclip)',
    options: { permissions: ['admin'] },
    callback: async (player) => {
        const rPlayer = Rebar.usePlayer(player);
        const currentState = flyState.get(player.id) || false;
        const newState = !currentState;
        
        flyState.set(player.id, newState);
        alt.emitClient(player, FlyEvents.toClient.toggle, newState);
        
        rPlayer.notify.showNotification(newState ? 'Fly mode enabled' : 'Fly mode disabled');
    },
});

// Clean up fly state when player disconnects
alt.on('playerDisconnect', (player) => {
    flyState.delete(player.id);
});
