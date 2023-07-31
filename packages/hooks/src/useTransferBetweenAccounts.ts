import { useFetch } from '@deriv/api';

const useTransferBetweenAccounts = () => {
    const { data, ...rest } = useFetch('transfer_between_accounts', {
        payload: { accounts: 'all' },
    });

    return {
        ...rest,
        accounts: data?.accounts,
    };
};

export default useTransferBetweenAccounts;
