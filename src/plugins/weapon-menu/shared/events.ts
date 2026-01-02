export const WeaponMenuEvents = {
    toServer: {
        giveWeapon: 'weaponmenu:server:give',
        toggleFavorite: 'weaponmenu:server:togglefavorite',
        getFavorites: 'weaponmenu:server:getfavorites',
    },
    toWebview: {
        open: 'weaponmenu:webview:open',
        close: 'weaponmenu:webview:close',
        setFavorites: 'weaponmenu:webview:setfavorites',
    },
    toClient: {
        open: 'weaponmenu:client:open',
        close: 'weaponmenu:client:close',
    },
};
