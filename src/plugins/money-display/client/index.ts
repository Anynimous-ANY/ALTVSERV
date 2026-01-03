import * as alt from 'alt-client';
import { useRebarClient } from '../../../main/client/index.js';
import { MoneyEvents } from '../shared/events.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();

// Handle bank menu open from server
function handleOpenBankMenu() {
    try {
        // Focus webview for bank menu
        webview.focus();
        
        // Disable game controls
        alt.toggleGameControls(false);
    } catch (error) {
        console.error('[Money Display Client] Error opening bank menu:', error);
        // Try to recover by re-enabling controls
        alt.toggleGameControls(true);
    }
}

// Handle bank menu close from server
function handleCloseBankMenu() {
    try {
        // Unfocus webview
        webview.unfocus();
        
        // Enable game controls
        alt.toggleGameControls(true);
    } catch (error) {
        console.error('[Money Display Client] Error closing bank menu:', error);
        // Always ensure controls are enabled
        alt.toggleGameControls(true);
    }
}

// Handle ESC key to close bank menu
alt.on('keyup', (key: number) => {
    try {
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
    } catch (error) {
        console.error('[Money Display Client] Error handling ESC key:', error);
    }
});

// Register client events
alt.onServer(MoneyEvents.toClient.openBankMenu, handleOpenBankMenu);
alt.onServer(MoneyEvents.toClient.closeBankMenu, handleCloseBankMenu);
