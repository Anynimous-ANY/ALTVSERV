<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';
import { WEAPONS, type Weapon } from '../shared/weapons';
import { WeaponMenuEvents } from '../shared/events';
import { WEAPON_COMPONENTS, WEAPON_TINTS } from '../shared/weaponComponents';

const events = useEvents();

const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const currentTab = ref<'all' | 'favorites' | 'modify'>('all');
const favorites = ref<string[]>([]);
const currentWeapons = ref<any[]>([]);
const selectedWeapon = ref<Weapon | null>(null);
const selectedModifyWeapon = ref<any | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Footer help text items
const footerItems = [
    'ESC to close',
    'You can walk/drive while menu is open',
    'Click weapon to buy',
    '⭐ to favorite'
];
const footerText = footerItems.join(' | ');

// Constants
const WEAPON_REFRESH_DELAY = 300; // ms - delay to allow server processing before refresh

let searchDebounceTimer: number | null = null;

// Debounce search query
watch(searchQuery, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = window.setTimeout(() => {
        debouncedSearchQuery.value = newValue;
    }, 300);
});

// Watch for tab changes to load current weapons when switching to modify tab
watch(currentTab, (newTab) => {
    // Ensure menu is visible when switching tabs
    isLoading.value = false;
    error.value = null;
    
    if (newTab === 'modify') {
        loadCurrentWeapons();
    }
});

// Filter weapons based on search query
const filteredWeapons = computed(() => {
    let weapons = WEAPONS;

    // Filter by tab
    if (currentTab.value === 'favorites') {
        weapons = weapons.filter((w) => favorites.value.includes(w.hash));
    } else if (currentTab.value === 'modify') {
        // For modify tab, return empty (we show currentWeapons instead)
        return [];
    }

    // Filter by search query
    if (debouncedSearchQuery.value.trim() !== '') {
        const query = debouncedSearchQuery.value.toLowerCase().trim();
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
    if (!weapon || !weapon.hash) {
        error.value = 'Invalid weapon selected';
        return;
    }

    try {
        selectedWeapon.value = weapon;
        events.emitServer(WeaponMenuEvents.toServer.giveWeapon, weapon.hash);
        // Note: Weapon list will be automatically refreshed by handleWeaponGiven event
    } catch (err) {
        console.error('Error selecting weapon:', err);
        error.value = 'Failed to select weapon';
    }
}

function toggleFavorite(weapon: Weapon, event: Event) {
    event.stopPropagation();

    if (!weapon || !weapon.hash) {
        error.value = 'Invalid weapon';
        return;
    }

    try {
        // Optimistically update the UI immediately
        const index = favorites.value.indexOf(weapon.hash);
        if (index > -1) {
            // Remove from favorites
            favorites.value.splice(index, 1);
        } else {
            // Check limit before adding
            if (favorites.value.length >= 20) {
                error.value = 'Maximum 20 favorite weapons allowed';
                return;
            }
            // Add to favorites
            favorites.value.push(weapon.hash);
        }

        // Also emit to server to save
        events.emitServer(WeaponMenuEvents.toServer.toggleFavorite, weapon.hash);
    } catch (err) {
        console.error('Error toggling favorite:', err);
        error.value = 'Failed to toggle favorite';
    }
}

function isFavorite(weapon: Weapon): boolean {
    if (!weapon || !weapon.hash) {
        return false;
    }
    return favorites.value.includes(weapon.hash);
}

// Get weapon emoji based on category
function getWeaponEmoji(weapon: Weapon | any): string {
    const category = weapon?.category || '';
    
    // Map categories to emojis
    switch (category) {
        case 'Handguns':
            return '🔫'; // Pistol emoji
        case 'SMGs':
            return '🔫'; // Pistol emoji (submachine guns)
        case 'Assault Rifles':
            return '🎯'; // Direct hit / rifle emoji
        case 'Sniper Rifles':
            return '🎯'; // Scope / precision emoji
        case 'Shotguns':
            return '💥'; // Collision / shotgun blast emoji
        case 'Machine Guns':
            return '⚡'; // High voltage / rapid fire emoji
        case 'Heavy Weapons':
            return '💣'; // Bomb emoji for launchers/explosives
        case 'Throwables':
            return '💣'; // Bomb emoji for grenades
        case 'Melee':
            return '🔪'; // Knife emoji for melee weapons
        case 'Misc':
            return '🛠️'; // Tools emoji for misc items
        default:
            return '❓'; // Question mark for unknown
    }
}

function setFavorites(favs: string[] | null) {
    try {
        if (!favs || !Array.isArray(favs)) {
            favorites.value = [];
            return;
        }
        favorites.value = favs;
        isLoading.value = false;
    } catch (err) {
        console.error('Error setting favorites:', err);
        error.value = 'Failed to load favorites';
        favorites.value = [];
        isLoading.value = false;
    }
}

function closeMenu() {
    try {
        // Reset state
        selectedWeapon.value = null;
        searchQuery.value = '';
        debouncedSearchQuery.value = '';
        error.value = null;

        // Emit to client to hide the page
        events.emitClient('weaponmenu:client:requestClose');
    } catch (err) {
        console.error('Error closing menu:', err);
    }
}

function handleOpen() {
    try {
        isLoading.value = true;
        error.value = null;
        events.emitServer(WeaponMenuEvents.toServer.getFavorites);
    } catch (err) {
        console.error('Error opening menu:', err);
        error.value = 'Failed to open menu';
        isLoading.value = false;
    }
}

function handleClose() {
    selectedWeapon.value = null;
    selectedModifyWeapon.value = null;
    searchQuery.value = '';
    debouncedSearchQuery.value = '';
    error.value = null;
}

// Modify tab functions
function loadCurrentWeapons() {
    try {
        events.emitServer(WeaponMenuEvents.toServer.getCurrentWeapons);
    } catch (err) {
        console.error('Error loading current weapons:', err);
    }
}

function setCurrentWeapons(weapons: any[]) {
    try {
        currentWeapons.value = weapons || [];
        
        // Update selected weapon if it's still in the list
        if (selectedModifyWeapon.value) {
            const updatedWeapon = weapons.find(w => w.hash === selectedModifyWeapon.value?.hash);
            if (updatedWeapon) {
                selectedModifyWeapon.value = updatedWeapon;
            }
        }
    } catch (err) {
        console.error('Error setting current weapons:', err);
    }
}

function getWeaponName(weaponOrHash: any): string {
    // If it's an object with a name property, use that (server provides this now)
    if (typeof weaponOrHash === 'object' && weaponOrHash.name) {
        return weaponOrHash.name;
    }
    
    // Fallback for numeric hash
    const hash = typeof weaponOrHash === 'number' ? weaponOrHash : weaponOrHash.hash;
    return `Weapon ${hash}`;
}

function removeWeapon(weapon: any) {
    try {
        const numericHash = weapon.numericHash || weapon.hash;
        events.emitServer(WeaponMenuEvents.toServer.removeWeapon, numericHash);
        // Reset selected weapon after removal
        selectedModifyWeapon.value = null;
    } catch (err) {
        console.error('Error removing weapon:', err);
    }
}

function changeTint(weapon: any, tintIndex: number) {
    try {
        const numericHash = weapon.numericHash || weapon.hash;
        events.emitServer(WeaponMenuEvents.toServer.setWeaponTint, numericHash, tintIndex);
        // Refresh weapons list to show updated tint
        setTimeout(() => loadCurrentWeapons(), 500);
    } catch (err) {
        console.error('Error changing tint:', err);
    }
}

function changeAmmo(weapon: any, ammo: number) {
    try {
        const numericHash = weapon.numericHash || weapon.hash;
        const ammoValue = Math.max(0, parseInt(String(ammo)) || 0);
        events.emitServer(WeaponMenuEvents.toServer.setWeaponAmmo, numericHash, ammoValue);
        // Update local state immediately for better UX
        if (selectedModifyWeapon.value && selectedModifyWeapon.value.hash === weapon.hash) {
            selectedModifyWeapon.value.ammo = ammoValue;
        }
        const weaponIndex = currentWeapons.value.findIndex(w => w.hash === weapon.hash);
        if (weaponIndex !== -1) {
            currentWeapons.value[weaponIndex].ammo = ammoValue;
        }
    } catch (err) {
        console.error('Error changing ammo:', err);
    }
}

function addComponent(weapon: any, componentHash: number) {
    try {
        const numericHash = weapon.numericHash || weapon.hash;
        events.emitServer(WeaponMenuEvents.toServer.addWeaponComponent, numericHash, componentHash);
        // Server will send updated weapons list via setCurrentWeapons event
    } catch (err) {
        console.error('Error adding component:', err);
    }
}

function removeComponent(weapon: any, componentHash: number) {
    try {
        const numericHash = weapon.numericHash || weapon.hash;
        events.emitServer(WeaponMenuEvents.toServer.removeWeaponComponent, numericHash, componentHash);
        // Server will send updated weapons list via setCurrentWeapons event
    } catch (err) {
        console.error('Error removing component:', err);
    }
}

function selectModifyWeapon(weapon: any) {
    selectedModifyWeapon.value = weapon;
}

// Get available components for a weapon
const availableComponents = computed(() => {
    if (!selectedModifyWeapon.value) return [];
    
    const weaponDef = WEAPONS.find(w => {
        const hash = typeof w.hash === 'string' ? w.hash : `weapon_${w.name.toLowerCase().replace(/\s+/g, '')}`;
        return hash === selectedModifyWeapon.value.name?.toLowerCase().replace(/\s+/g, '_') || 
               w.name === selectedModifyWeapon.value.name;
    });
    
    if (!weaponDef) return [];
    
    const weaponHashStr = typeof weaponDef.hash === 'string' ? weaponDef.hash : `weapon_${weaponDef.name.toLowerCase().replace(/\s+/g, '')}`;
    
    return WEAPON_COMPONENTS.filter(comp => 
        comp.weaponHashes.includes(weaponHashStr)
    );
});

// Check if a component is currently attached
function isComponentAttached(componentHash: number): boolean {
    if (!selectedModifyWeapon.value || !selectedModifyWeapon.value.components) return false;
    return selectedModifyWeapon.value.components.includes(componentHash);
}

// Get component price based on component hash
function getComponentPrice(componentHash: number): number {
    const SUPPRESSOR_HASHES = [0x65EA7EBB, 0xC304849A, 0xA73D4664, 0x837445AA, 0x8C8DCC43, 0xA564D78B];
    const EXTENDED_CLIP_HASHES = [0xED265A1C, 0xD67B4F2D, 0x249A17D5, 0xD9D3AC92, 0x7B0033B3, 0x64F9C62B];
    const FLASHLIGHT_HASHES = [0x359B7AAE, 0x9D65907A, 0xAF89DCE3];
    const SCOPE_HASHES = [0xBC54DA77, 0x1B4C088B, 0xA0D89C42, 0x3CC6BA57, 0x9BC64089];
    const GRIP_HASHES = [0xC164F53, 0xB1929A4, 0x9D2FBF29];
    const LUXURY_FINISH_HASHES = [0xD7391086, 0xC6654D72, 0x9B76C72C, 0x77B8AB2F, 0x80DA5257];
    
    if (SUPPRESSOR_HASHES.includes(componentHash)) return 5000;
    if (EXTENDED_CLIP_HASHES.includes(componentHash)) return 3000;
    if (FLASHLIGHT_HASHES.includes(componentHash)) return 2000;
    if (SCOPE_HASHES.includes(componentHash)) return 8000;
    if (GRIP_HASHES.includes(componentHash)) return 2500;
    if (LUXURY_FINISH_HASHES.includes(componentHash)) return 10000;
    
    // Default price for other components
    return 1500;
}

// Handle weapon given event - refresh current weapons list
function handleWeaponGiven() {
    try {
        // Ensure menu content is visible
        isLoading.value = false;
        error.value = null;
        
        // Refresh current weapons list after weapon is given
        // Delay allows server to process the weapon addition
        setTimeout(() => {
            loadCurrentWeapons();
        }, WEAPON_REFRESH_DELAY);
    } catch (err) {
        console.error('Error handling weapon given:', err);
    }
}

function handleInputFocus() {
    try {
        events.emitClient('weaponmenu:inputFocused');
    } catch (err) {
        console.error('Error handling input focus:', err);
    }
}

function handleInputBlur() {
    try {
        events.emitClient('weaponmenu:inputBlurred');
    } catch (err) {
        console.error('Error handling input blur:', err);
    }
}

onMounted(() => {
    try {
        if (!events) {
            console.error('Events composable not available');
            return;
        }

        events.on(WeaponMenuEvents.toWebview.setFavorites, setFavorites);
        events.on(WeaponMenuEvents.toWebview.setCurrentWeapons, setCurrentWeapons);
        events.on(WeaponMenuEvents.toWebview.open, handleOpen);
        events.on(WeaponMenuEvents.toWebview.close, handleClose);
        events.on(WeaponMenuEvents.toWebview.weaponGiven, handleWeaponGiven);
        events.emitServer(WeaponMenuEvents.toServer.getFavorites);
    } catch (err) {
        console.error('Error in onMounted:', err);
        error.value = 'Failed to initialize menu';
    }
});

onUnmounted(() => {
    try {
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }

        // Note: useEvents composable doesn't provide an 'off' method
        // Event handlers will be automatically cleaned up when the component is destroyed
    } catch (err) {
        console.error('Error in onUnmounted:', err);
    }
});
</script>

<template>
    <div class="fixed left-8 top-1/2 z-50 flex h-[600px] w-[400px] -translate-y-1/2 flex-col overflow-hidden rounded-2xl border-2 border-gray-700 bg-gray-900 bg-opacity-95 shadow-2xl" role="dialog" aria-labelledby="weapon-menu-title" aria-modal="true">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
            <h2 id="weapon-menu-title" class="text-xl font-bold text-white">Weapon Menu</h2>
            <button @click="closeMenu" class="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Close weapon menu">
                Close
            </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="border-b border-red-700 bg-red-900 bg-opacity-80 px-4 py-2 text-center text-sm text-white">
            {{ error }}
        </div>

        <!-- Search Bar -->
        <div class="border-b border-gray-700 bg-gray-800 px-4 py-3">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search weapons..."
                class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                aria-label="Search weapons"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
            />
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-700 bg-gray-800" role="tablist">
            <button
                @click="currentTab = 'all'"
                class="flex-1 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                :class="currentTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
                role="tab"
                :aria-selected="currentTab === 'all'"
                aria-controls="all-weapons-panel"
            >
                All Weapons
            </button>
            <button
                @click="currentTab = 'favorites'"
                class="flex-1 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                :class="currentTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
                role="tab"
                :aria-selected="currentTab === 'favorites'"
                aria-controls="favorites-panel"
            >
                ⭐ Favorites
            </button>
            <button
                @click="currentTab = 'modify'; loadCurrentWeapons()"
                class="flex-1 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                :class="currentTab === 'modify' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
                role="tab"
                :aria-selected="currentTab === 'modify'"
                aria-controls="modify-panel"
            >
                🔧 Modify
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-1 items-center justify-center">
            <p class="text-gray-400">Loading weapons...</p>
        </div>

        <!-- Weapon List (All & Favorites tabs) -->
        <div v-if="currentTab !== 'modify'" v-show="!isLoading" class="flex-1 overflow-y-auto p-4" role="tabpanel" :id="currentTab === 'all' ? 'all-weapons-panel' : 'favorites-panel'">
            <template v-if="Object.keys(groupedWeapons).length > 0">
                <div v-for="(weapons, category) in groupedWeapons" :key="category" class="mb-4">
                    <h3 class="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">{{ category }}</h3>
                    <div class="space-y-2" role="list">
                        <div
                            v-for="weapon in weapons"
                            :key="weapon.hash"
                            @click="selectWeapon(weapon)"
                            class="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-800 px-4 py-3 transition hover:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500"
                            :class="selectedWeapon?.hash === weapon.hash ? 'ring-2 ring-blue-500' : ''"
                            role="listitem"
                            tabindex="0"
                            @keydown.enter="selectWeapon(weapon)"
                            @keydown.space.prevent="selectWeapon(weapon)"
                        >
                            <!-- Weapon Emoji Icon -->
                            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-700">
                                <span class="text-2xl">{{ getWeaponEmoji(weapon) }}</span>
                            </div>
                            
                            <!-- Weapon Info -->
                            <div class="flex-1">
                                <p class="font-semibold text-white">{{ weapon.name }}</p>
                                <div class="flex items-center gap-2 text-xs">
                                    <span class="text-gray-400">{{ weapon.hash }}</span>
                                    <span class="font-bold text-green-400">{{ weapon.price > 0 ? `${weapon.price}€` : 'FREE' }}</span>
                                </div>
                            </div>
                            
                            <!-- Favorite Button -->
                            <button
                                @click="toggleFavorite(weapon, $event)"
                                class="ml-2 text-2xl transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                :class="isFavorite(weapon) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'"
                                :aria-label="isFavorite(weapon) ? 'Remove from favorites' : 'Add to favorites'"
                                tabindex="0"
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

        <!-- Modify Weapons Tab -->
        <div v-if="currentTab === 'modify'" class="flex flex-1 overflow-hidden" role="tabpanel" id="modify-panel">
            <!-- Weapons List -->
            <div class="w-1/2 overflow-y-auto border-r border-gray-700 p-4">
                <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">Your Weapons</h3>
                <div v-if="currentWeapons.length > 0" class="space-y-2">
                    <div
                        v-for="weapon in currentWeapons"
                        :key="weapon.hash"
                        @click="selectModifyWeapon(weapon)"
                        class="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 transition hover:bg-gray-700"
                        :class="selectedModifyWeapon?.hash === weapon.hash ? 'ring-2 ring-blue-500' : ''"
                    >
                        <!-- Weapon Emoji Icon -->
                        <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-700">
                            <span class="text-xl">{{ getWeaponEmoji(weapon) }}</span>
                        </div>
                        
                        <!-- Weapon Info -->
                        <div class="flex-1">
                            <p class="text-sm font-semibold text-white">{{ weapon.name || getWeaponName(weapon) }}</p>
                            <p class="text-xs text-gray-400">Ammo: {{ weapon.ammo }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="flex h-32 items-center justify-center">
                    <p class="text-sm text-gray-400">No weapons equipped</p>
                </div>
            </div>

            <!-- Modification Panel -->
            <div class="w-1/2 overflow-y-auto p-4">
                <div v-if="selectedModifyWeapon">
                    <!-- Weapon Emoji Icon -->
                    <div class="mb-4 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-700">
                        <span class="text-6xl">{{ getWeaponEmoji(selectedModifyWeapon) }}</span>
                    </div>
                    
                    <h3 class="mb-3 text-sm font-bold text-white">{{ selectedModifyWeapon.name || getWeaponName(selectedModifyWeapon) }}</h3>
                    
                    <!-- Tint Selection -->
                    <div class="mb-4">
                        <label class="mb-2 block text-xs font-semibold text-gray-400">Weapon Tint</label>
                        <select
                            :value="selectedModifyWeapon.tintIndex"
                            @change="changeTint(selectedModifyWeapon, parseInt(($event.target as HTMLSelectElement).value))"
                            class="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option v-for="tint in WEAPON_TINTS" :key="tint.id" :value="tint.id">
                                {{ tint.name }} {{ tint.price > 0 ? `- ${tint.price}€` : '- Free' }}
                            </option>
                        </select>
                    </div>

                    <!-- Ammo Setting -->
                    <div class="mb-4">
                        <label class="mb-2 block text-xs font-semibold text-gray-400">Ammo Amount</label>
                        <input
                            type="number"
                            :value="selectedModifyWeapon.ammo"
                            @change="changeAmmo(selectedModifyWeapon, parseInt(($event.target as HTMLInputElement).value))"
                            min="0"
                            max="9999"
                            class="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <!-- Components Management -->
                    <div class="mb-4">
                        <label class="mb-2 block text-xs font-semibold text-gray-400">Weapon Components</label>
                        
                        <!-- Currently Attached Components -->
                        <div v-if="selectedModifyWeapon.components.length > 0" class="mb-3">
                            <p class="mb-2 text-xs text-gray-500">Attached ({{ selectedModifyWeapon.components.length }}):</p>
                            <div class="space-y-1">
                                <div 
                                    v-for="comp in WEAPON_COMPONENTS.filter(c => isComponentAttached(c.hash))" 
                                    :key="comp.hash"
                                    class="flex items-center justify-between rounded bg-gray-600 px-2 py-1"
                                >
                                    <span class="text-xs text-white">{{ comp.name }} <span class="text-gray-400">({{ getComponentPrice(comp.hash) }}€)</span></span>
                                    <button
                                        @click="removeComponent(selectedModifyWeapon, comp.hash)"
                                        class="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p v-else class="mb-3 text-xs text-gray-500">No components attached</p>
                        
                        <!-- Available Components to Add -->
                        <div v-if="availableComponents.length > 0">
                            <p class="mb-2 text-xs text-gray-500">Available to add:</p>
                            <div class="max-h-32 space-y-1 overflow-y-auto">
                                <div 
                                    v-for="comp in availableComponents.filter(c => !isComponentAttached(c.hash))" 
                                    :key="comp.hash"
                                    class="flex items-center justify-between rounded bg-gray-600 px-2 py-1"
                                >
                                    <span class="text-xs text-white">{{ comp.name }} <span class="text-green-400">({{ getComponentPrice(comp.hash) }}€)</span></span>
                                    <button
                                        @click="addComponent(selectedModifyWeapon, comp.hash)"
                                        class="rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p v-else class="text-xs text-gray-500">No components available for this weapon</p>
                    </div>

                    <!-- Remove Weapon Button -->
                    <button
                        @click="removeWeapon(selectedModifyWeapon)"
                        class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Remove Weapon
                    </button>
                </div>
                <div v-else class="flex h-full items-center justify-center">
                    <p class="text-sm text-gray-400">Select a weapon to modify</p>
                </div>
            </div>
        </div>

        <!-- Footer Info -->
        <div class="border-t border-gray-700 bg-gray-800 px-4 py-2 text-center text-xs text-gray-400">
            {{ footerText }}
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
