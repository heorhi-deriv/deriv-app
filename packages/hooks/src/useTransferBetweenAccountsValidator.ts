import { useState } from 'react';
import useGetLimits from './useGetLimits';
import { formatMoney } from '../../shared/src/utils/currency';
import { localize } from '@deriv/translations';

export type TMessageItem =
    | {
          variant: 'base';
          id: string;
          type: 'info' | 'error' | 'success';
          message: string | JSX.Element;
      }
    | {
          variant: 'with-action-button';
          onClickHandler: VoidFunction;
          button_label: string;
          id: string;
          type: 'info' | 'error' | 'success';
          message: string | JSX.Element;
      };

const useTransferBetweenAccountsValidator = (): any => {
    const { data: limits_data } = useGetLimits();
    const account_limits = limits_data.get_limits;

    const [errorList, setErrorList] = useState<TMessageItem[]>([]);

    const fieldValidator = (from_account, from_amount?, to_account) => {
        const minimum_transfer_limit = account_limits.per_transfer[to_account.account_type].minimum;
        const maximum_transfer_limit = account_limits.per_transfer[to_account.account_type].maximum;
        setErrorList([]);
        if (from_amount === 0) {
            setErrorList([
                {
                    variant: 'base',
                    id: '1',
                    type: 'success',
                    message: localize('Transfer limit: {{min}} - {{max}}', {
                        min: `${formatMoney(from_account.currency || '', minimum_transfer_limit, true)}`,
                        max: `${formatMoney(from_account.currency || '', from_account.balance, true)} ${
                            from_account.currency
                        }`,
                    }),
                },
            ]);
            return;
        }
        if (from_account.balance < minimum_transfer_limit) {
            setErrorList([
                ...errorList,
                {
                    variant: 'base',
                    id: '1',
                    type: 'error',
                    message: `The balance of the selected trading account is less than ${formatMoney(
                        from_account.currency || '',
                        minimum_transfer_limit,
                        true
                    )}.`,
                },
            ]);
        }
        if (from_amount < minimum_transfer_limit || from_amount > maximum_transfer_limit) {
            setErrorList([
                {
                    variant: 'base',
                    id: '1',
                    type: 'error',
                    message: localize('Transfer limit: {{min}} - {{max}}', {
                        min: `${formatMoney(from_account.currency || '', minimum_transfer_limit, true)}`,
                        max: `${formatMoney(from_account.currency || '', from_account.balance, true)} ${
                            from_account.currency
                        }`,
                    }),
                },
            ]);
        } else {
            setErrorList([
                {
                    variant: 'base',
                    id: '1',
                    type: 'success',
                    message: localize('Transfer limit: {{min}} - {{max}}', {
                        min: `${formatMoney(from_account.currency || '', minimum_transfer_limit, true)}`,
                        max: `${formatMoney(from_account.currency || '', from_account.balance, true)} ${
                            from_account.currency
                        }`,
                    }),
                },
            ]);
        }
    };

    return {
        errorList,
        setErrorList,
        fieldValidator,
    };
};

export default useTransferBetweenAccountsValidator;
