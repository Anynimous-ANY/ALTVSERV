import * as alt from 'alt-client';
import { useRebarClient } from '../../../main/client/index.js';
import { MoneyEvents } from '../shared/events.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();

// Handle bank menu open from server
function handleOpenBankMenu() {
    // Focus webview for bank menu
    webview.focus();
    
    // Disable game controls
    alt.toggleGameControls(false);
}

// Handle bank menu close from server
function handleCloseBankMenu() {
    // Unfocus webview
    webview.unfocus();
    
    // Enable game controls
    alt.toggleGameControls(true);
}

// Handle ESC key to close bank menu
alt.on('keyup', (key: number) => {
    // ESC key
    if (key !== 27) {
        return;
    }
    
    // Check if bank menu is open
    if (!webview.isPageOpen('BankMenu')) {
        return;
    }
    
    // Close bank menu
    alt.emitServer(MoneyEvents.toServer.closeBank);
});

// Register client events
alt.onServer(MoneyEvents.toClient.openBankMenu, handleOpenBankMenu);
alt.onServer(MoneyEvents.toClient.closeBankMenu, handleCloseBankMenu);
