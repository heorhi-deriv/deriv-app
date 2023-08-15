import { useFetch } from '@deriv/api';

const useGetLimits = () => {
    // const { data, ...rest } = useFetch('get_limits', options);
    const data = {
        get_limits: {
            daily_cumulative_amount_transfers: {
                enabled: 1,
            },
            daily_transfers: {
                ctrader: {
                    allowed: 10,
                    available: 9,
                    limit_type: 'count',
                },
                derivez: {
                    allowed: '10000.00',
                    available: '9900.00',
                    limit_type: 'amount',
                },
                //   "dtrade": {...},
                //   "dxtrade": {...},
                //   "internal": {... },
                //   "mt5": {...},
                wallet: {
                    minimum: '0.01',
                    maximum: '1000.00',
                },
                //   "virtual": {...}
            },
            per_transfer: {
                ctrader: {
                    minimum: '0.01',
                    maximum: '1000.00',
                },
                //   "derivez": {...},
                trading: {
                    minimum: '1',
                    maximum: '1000.00',
                },
                //   "dxtrade": {...},
                //   "internal": {... },
                mt5: {
                    minimum: '0.01',
                    maximum: '1000.00',
                },
                wallet: {
                    minimum: '0.01',
                    maximum: '1000.00',
                },
                //   "wallets": {...},
                //   "virtual": {...}
            },
            unauthenticated_transfers: {
                crypto_to_crypto: {
                    allowed: '200.00',
                    available: '100:00',
                },
                crypto_to_fiat: {
                    allowed: '500.00',
                    available: '500:00',
                },
                fiat_to_crypto: {
                    allowed: '1000.00',
                    available: '950.00',
                },
            },
        },
    };

    return {
        data,
    };
};

export default useGetLimits;
