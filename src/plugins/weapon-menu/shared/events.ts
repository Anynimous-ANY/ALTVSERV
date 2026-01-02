export const WeaponMenuEvents = {
    toServer: {
        giveWeapon: 'weaponmenu:server:give',
        toggleFavorite: 'weaponmenu:server:togglefavorite',
        getFavorites: 'weaponmenu:server:getfavorites',
        getCurrentWeapons: 'weaponmenu:server:getcurrentweapons',
        removeWeapon: 'weaponmenu:server:removeweapon',
        setWeaponTint: 'weaponmenu:server:setweapontint',
        setWeaponAmmo: 'weaponmenu:server:setweaponammo',
        addWeaponComponent: 'weaponmenu:server:addweaponcomponent',
        removeWeaponComponent: 'weaponmenu:server:removeweaponcomponent',
    },
    toWebview: {
        open: 'weaponmenu:webview:open',
        close: 'weaponmenu:webview:close',
        setFavorites: 'weaponmenu:webview:setfavorites',
        setCurrentWeapons: 'weaponmenu:webview:setcurrentweapons',
    },
    toClient: {
        open: 'weaponmenu:client:open',
        close: 'weaponmenu:client:close',
    },
};
