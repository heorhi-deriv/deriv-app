import { useMemo } from 'react';
import { useStore } from '@deriv/stores';
import useActiveWallet from './useActiveWallet';
import useCurrencyConfig from './useCurrencyConfig';
import useExistingCFDAccounts from './useExistingCFDAccounts';
import useWalletsList from './useWalletsList';

type TAccount = {
    account_type?: 'wallet' | 'binary' | 'trading' | 'mt5' | 'dxtrade' | 'derivez';
    balance?: string;
    currency?: string;
    demo_account?: number | boolean;
    loginid?: string;
};

type TPopulatedAccounts<T> = Record<string, NonNullable<T>>;

const usePopulateAccounts = <T extends TAccount[]>(accounts?: T) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const active_wallet = useActiveWallet();

    const { data: wallets } = useWalletsList();

    const { getConfig } = useCurrencyConfig();

    const trading_apps_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';

    const {
        data: { derivez_accounts, dxtrade_accounts, mt5_accounts },
        isSuccess: is_cfd_accounts_loaded,
    } = useExistingCFDAccounts();

    const modified_accounts = useMemo(() => {
        if (!is_cfd_accounts_loaded) return { trading_accounts: {}, wallet_accounts: {} };

        const all_linked_cfd_accounts = [...derivez_accounts, ...dxtrade_accounts, ...mt5_accounts];

        const getAccountType = (is_demo?: number | boolean, currency?: string): 'fiat' | 'crypto' | 'demo' => {
            if (is_demo) return 'demo';
            return getConfig(currency || '')?.is_crypto ? 'crypto' : 'fiat';
        };

        const populated_accounts = accounts?.map(account => {
            const cfd_icon = all_linked_cfd_accounts.find(
                cfd_account => account.loginid && cfd_account.loginid?.includes(account.loginid)
            )?.transfer_icon;

            const available_wallet = wallets?.find(wallet => wallet.loginid === account.loginid);

            return {
                ...account,
                active_wallet_icon: active_wallet?.icon,
                balance: parseFloat(
                    Number(account.balance).toFixed(getConfig(account.currency || '')?.fractional_digits)
                ),
                display_currency_code: getConfig(account.currency || '')?.display_code,
                is_demo: Boolean(account?.demo_account),
                shortcode: active_wallet?.landing_company_name,
                type: getAccountType(account.demo_account, account.currency),
                ...(account.account_type !== 'wallet' && {
                    gradient_class: active_wallet?.gradient_card_class,
                    icon: account.account_type === 'trading' ? trading_apps_icon : cfd_icon,
                    ...(account.account_type === 'mt5' && {
                        mt5_market_type: mt5_accounts?.find(
                            mt5_account => account.loginid && mt5_account.loginid?.includes(account.loginid)
                        )?.market_type,
                    }),
                }),
                ...(account.account_type === 'wallet' && {
                    gradient_class: available_wallet?.gradient_card_class,
                    icon: available_wallet?.icon,
                }),
            };
        });

        return {
            trading_accounts:
                populated_accounts?.reduce((trading_accounts, account) => {
                    if (account.account_type === 'wallet') return trading_accounts;
                    if (!account.loginid) return trading_accounts;

                    trading_accounts[account.loginid] = { ...account };

                    return trading_accounts;
                }, {} as TPopulatedAccounts<typeof populated_accounts[number]>) || {},
            wallet_accounts:
                populated_accounts?.reduce((wallet_accounts, wallet) => {
                    if (wallet.account_type !== 'wallet') return wallet_accounts;
                    if (!wallet.loginid) return wallet_accounts;

                    wallet_accounts[wallet.loginid] = { ...wallet };

                    return wallet_accounts;
                }, {} as TPopulatedAccounts<typeof populated_accounts[number]>) || {},
        };
    }, [
        is_cfd_accounts_loaded,
        derivez_accounts,
        dxtrade_accounts,
        mt5_accounts,
        accounts,
        getConfig,
        wallets,
        active_wallet?.icon,
        active_wallet?.landing_company_name,
        active_wallet?.gradient_card_class,
        trading_apps_icon,
    ]);

    const modified_active_wallet = useMemo(() => {
        return active_wallet?.loginid
            ? {
                  ...modified_accounts.wallet_accounts?.[active_wallet?.loginid],
              }
            : undefined;
    }, [active_wallet?.loginid, modified_accounts?.wallet_accounts]);

    return {
        active_wallet: modified_active_wallet,
        trading_accounts: modified_accounts.trading_accounts,
        wallet_accounts: modified_accounts.wallet_accounts,
    };
};

export default usePopulateAccounts;
