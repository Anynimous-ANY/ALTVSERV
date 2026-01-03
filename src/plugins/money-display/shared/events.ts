export const MoneyEvents = {
    toWebview: {
        updateMoney: 'money:toWebview:updateMoney',
        depositResult: 'money:toWebview:depositResult',
        withdrawResult: 'money:toWebview:withdrawResult',
    },
    toServer: {
        openBank: 'money:toServer:openBank',
        closeBank: 'money:toServer:closeBank',
        deposit: 'money:toServer:deposit',
        withdraw: 'money:toServer:withdraw',
        requestMoney: 'money:toServer:requestMoney',
    },
    toClient: {
        openBankMenu: 'money:toClient:openBankMenu',
        closeBankMenu: 'money:toClient:closeBankMenu',
    },
};
