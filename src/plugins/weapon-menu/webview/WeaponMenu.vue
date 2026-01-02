<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';
import { WEAPONS, type Weapon } from '../shared/weapons';
import { WeaponMenuEvents } from '../shared/events';

const events = useEvents();

const searchQuery = ref('');
const currentTab = ref<'all' | 'favorites'>('all');
const favorites = ref<string[]>([]);
const selectedWeapon = ref<Weapon | null>(null);

// Filter weapons based on search query
const filteredWeapons = computed(() => {
    let weapons = WEAPONS;

    // Filter by tab
    if (currentTab.value === 'favorites') {
        weapons = weapons.filter((w) => favorites.value.includes(w.hash));
    }

    // Filter by search query
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase();
        weapons = weapons.filter(
            (w) =>
                w.name.toLowerCase().includes(query) ||
                w.category.toLowerCase().includes(query) ||
                w.hash.toLowerCase().includes(query)
        );
    }

    return weapons;
});

// Group weapons by category
const groupedWeapons = computed(() => {
    const groups: { [key: string]: Weapon[] } = {};

    for (const weapon of filteredWeapons.value) {
        if (!groups[weapon.category]) {
            groups[weapon.category] = [];
        }
        groups[weapon.category].push(weapon);
    }

    return groups;
});

function selectWeapon(weapon: Weapon) {
    selectedWeapon.value = weapon;
    events.emitServer(WeaponMenuEvents.toServer.giveWeapon, weapon.hash);
}

function toggleFavorite(weapon: Weapon, event: Event) {
    event.stopPropagation();
    events.emitServer(WeaponMenuEvents.toServer.toggleFavorite, weapon.hash);
}

function isFavorite(weapon: Weapon): boolean {
    return favorites.value.includes(weapon.hash);
}

function setFavorites(favs: string[]) {
    favorites.value = favs;
}

function closeMenu() {
    events.emitClient('rebar:hideWebview', 'WeaponMenu');
}

onMounted(() => {
    events.on(WeaponMenuEvents.toWebview.setFavorites, setFavorites);
    events.emitServer(WeaponMenuEvents.toServer.getFavorites);
});
</script>

<template>
    <div class="fixed left-8 top-1/2 flex h-[600px] w-[400px] -translate-y-1/2 flex-col overflow-hidden rounded-2xl border-2 border-gray-700 bg-gray-900 bg-opacity-95 shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
            <h2 class="text-xl font-bold text-white">Weapon Menu</h2>
            <button @click="closeMenu" class="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700">
                Close
            </button>
        </div>

        <!-- Search Bar -->
        <div class="border-b border-gray-700 bg-gray-800 px-4 py-3">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search weapons..."
                class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500"
            />
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-700 bg-gray-800">
            <button
                @click="currentTab = 'all'"
                class="flex-1 px-4 py-3 font-semibold transition"
                :class="currentTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
            >
                All Weapons
            </button>
            <button
                @click="currentTab = 'favorites'"
                class="flex-1 px-4 py-3 font-semibold transition"
                :class="currentTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
            >
                ⭐ Favorites
            </button>
        </div>

        <!-- Weapon List -->
        <div class="flex-1 overflow-y-auto p-4">
            <template v-if="Object.keys(groupedWeapons).length > 0">
                <div v-for="(weapons, category) in groupedWeapons" :key="category" class="mb-4">
                    <h3 class="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">{{ category }}</h3>
                    <div class="space-y-2">
                        <div
                            v-for="weapon in weapons"
                            :key="weapon.hash"
                            @click="selectWeapon(weapon)"
                            class="flex cursor-pointer items-center justify-between rounded-lg bg-gray-800 px-4 py-3 transition hover:bg-gray-700"
                            :class="selectedWeapon?.hash === weapon.hash ? 'ring-2 ring-blue-500' : ''"
                        >
                            <div class="flex-1">
                                <p class="font-semibold text-white">{{ weapon.name }}</p>
                                <p class="text-xs text-gray-400">{{ weapon.hash }}</p>
                            </div>
                            <button
                                @click="toggleFavorite(weapon, $event)"
                                class="ml-2 text-2xl transition"
                                :class="isFavorite(weapon) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'"
                            >
                                {{ isFavorite(weapon) ? '⭐' : '☆' }}
                            </button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="flex h-full items-center justify-center">
                    <p class="text-gray-400">
                        {{ currentTab === 'favorites' ? 'No favorite weapons yet' : 'No weapons found' }}
                    </p>
                </div>
            </template>
        </div>

        <!-- Footer Info -->
        <div class="border-t border-gray-700 bg-gray-800 px-4 py-2 text-center text-xs text-gray-400">
            Press ESC to close | Click weapon to select | Click star to favorite
        </div>
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}
</style>
