import React from 'react';
import { Money, StaticUrl } from '@deriv/components';
import { routes, website_name } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TGetMessage = {
    button_text?: JSX.Element;
    description: JSX.Element;
    has_attempts_hint?: boolean;
    icon?: string;
    is_primary_button?: boolean;
    is_primary_light_button?: boolean;
    onClick?: VoidFunction;
    title: JSX.Element;
    title_color?: string;
};

const getMessage = (history): TGetMessage => {
    // const has_insufficient_deposit_status = 'PaymentAgentInsufficientDeposit';
    const has_insufficient_deposit_status = '';
    const has_applied_status = 'PaymentAgentAlreadyApplied';
    // const has_suspended_status = 'PaymentAgentStatusNotEligible';
    const has_suspended_status = '';
    const has_locked_status = 'PaymentAgentClientStatusNotEligible';
    const has_attempts_to_reapply = 'PaymentAgentMaximumAttempts';
    const initial_deposit_per_country = 3000;

    if (has_insufficient_deposit_status) {
        return !has_applied_status
            ? {
                  button_text: <Localize i18n_default_text='Deposit now' />,
                  description: (
                      <Localize
                          i18n_default_text='If you want to become a payment agent, please fund your account with a minimun of <0/> USD to be eligible.'
                          components={[<Money key={0} amount={initial_deposit_per_country} />]}
                      />
                  ),
                  icon: 'IcCashierYellowWarning',
                  is_primary_button: true,
                  onClick: () => history.push(routes.cashier_deposit),
                  title: <Localize i18n_default_text="You don't meet the requirements" />,
                  title_color: 'warning',
              }
            : {
                  button_text: <Localize i18n_default_text='Top-up now' />,
                  description: (
                      <Localize
                          i18n_default_text="We've paused your application review as you've insufficient account balance. Please top-up your account until you have a balance of <0/> USD for us to continue the review."
                          components={[<Money key={0} amount={initial_deposit_per_country} />]}
                      />
                  ),
                  icon: 'IcCashierRedWarning',
                  is_primary_button: true,
                  onClick: () => history.push(routes.cashier_deposit),
                  title: <Localize i18n_default_text='Sign-up failed' />,
                  title_color: 'loss-danger',
              };
    } else if (has_suspended_status) {
        return {
            button_text: <Localize i18n_default_text='Go to live chat' />,
            description: (
                <Localize i18n_default_text='It seems like the document you submitted for verification is invalid. Please contact us via live chat for further assistance.' />
            ),
            icon: 'IcCashierRedWarning',
            is_primary_light_button: true,
            onClick: () => window.LC_API.open_chat_window(),
            title: <Localize i18n_default_text='Sign-up failed' />,
            title_color: 'loss-danger',
        };
    } else if (has_locked_status) {
        return {
            button_text: <Localize i18n_default_text='Go to live chat' />,
            description: (
                <Localize i18n_default_text='It seems that certain actions are restricted on your account. Please contact us via live chat to resolve this issue.' />
            ),
            icon: 'IcCashierYellowWarning',
            is_primary_light_button: true,
            onClick: () => window.LC_API.open_chat_window(),
            title: <Localize i18n_default_text='Your account is locked' />,
            title_color: 'warning',
        };
    } else if (!has_attempts_to_reapply) {
        return {
            button_text: <Localize i18n_default_text='Go to live chat' />,
            description: (
                <Localize i18n_default_text="It seems that you've reached the maximum number of applications. Please contact us via live chat for further assistance." />
            ),
            icon: 'IcCashierRedWarning',
            is_primary_light_button: true,
            onClick: () => window.LC_API.open_chat_window(),
            title: <Localize i18n_default_text='Your account is locked' />,
            title_color: 'loss-danger',
        };
    }

    return {
        button_text: <Localize i18n_default_text='Sign up' />,
        description: (
            <Localize
                i18n_default_text='Learn more about the <0>payment agent programme on {{website_name}}</0> and sign up to be one.'
                components={[<StaticUrl key={0} className='link' href='partners/payment-agent' />]}
                values={{ website_name }}
            />
        ),
        title: <Localize i18n_default_text='Want to become a payment agent?' />,
        title_color: 'prominent',
    };
};

export default getMessage;
