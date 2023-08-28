import { useFetch } from '@deriv/api';
import { useEffect, useRef, useState } from 'react';
import useTransferMessageBetweenWalletAndTradingApp from './useTransferMessageBetweenWalletAndTradingApp';

/* Generates and returns the list of all messages to be shown during the transfer based on the accounts passed */

const useTransferMessageList = (
    from_account: any,
    to_account: any
    // from_amount: number | undefined,
    // to_amount: number | undefined
): any => {
    const { data, ...rest } = useFetch('get_limits');
    const account_limits = data?.get_limits;

    const [message_list, setMessageList] = useState<any[]>([]);
    const m = useTransferMessageBetweenWalletAndTradingApp();

    console.log('=> from_account', from_account, '\nto_account', to_account);
    if (to_account) {
        setMessageList([m]);
    }
    // const { c } = useTransferMessageBetweenWalletAndTradingApp(from_account, to_account, from_amount, to_amount);

    return { message_list };
    /* 
        useTransferMessageBetweenWallets:
            Fiat-Crypto
            Crypto-Fiat
            Crypto-Crypto
            useTransferBetweenWalletsInfo:
                // will get the fees info
    */
    /* 
        useTransferMessageBetweenWalletAndTradingApp:
            RealWallet-TradingApp
            TradingApp-RealWallet
            DemoWallet-DemoTradingApp
            DemoTradingApp-DemoWallet
    */
};

export default useTransferMessageList;
