import React from 'react';
import { PaymentAgentDetailsResponse } from '@deriv/api-types';
import { Money, StaticUrl } from '@deriv/components';
import { routes, website_name } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { History } from 'history';
import { TNote } from './signup-side-note';

type TRestPaymentAgentdetailsFields = {
    eligibility_validation?: string[];
    can_apply?: 0 | 1;
};

type TGetNoteProps = {
    country_code: string;
    history: History;
    initial_deposit_per_country: { [key: string]: number };
    paymentagent_details: PaymentAgentDetailsResponse['paymentagent_details'] & TRestPaymentAgentdetailsFields;
    openWizard: VoidFunction;
};

const getNote = ({
    country_code,
    history,
    initial_deposit_per_country,
    openWizard,
    paymentagent_details,
}: TGetNoteProps): TNote => {
    const can_apply_to_be_a_payment_agent = !!paymentagent_details?.can_apply;
    const is_applied = paymentagent_details.status === 'applied';
    const is_authorized = paymentagent_details.status === 'authorized';
    const is_rejcted = paymentagent_details.status === 'rejected';
    const is_verified = paymentagent_details.status === 'verified';
    const insufficient_deposit = paymentagent_details.eligibility_validation?.some(
        status => status === 'PaymentAgentInsufficientDeposit'
    );
    const needs_poi = paymentagent_details.eligibility_validation?.some(status => status === 'NotAgeVerified');
    const needs_poa = paymentagent_details.eligibility_validation?.some(status => status === 'NotAuthenticated');
    const locked_account = paymentagent_details.eligibility_validation?.some(
        status => status === 'PaymentAgentClientStatusNotEligible'
    );
    const initial_deposit =
        initial_deposit_per_country[country_code.toUpperCase()] || initial_deposit_per_country.default;

    if (insufficient_deposit) {
        return is_rejcted
            ? {
                  button_text: <Localize i18n_default_text='Deposit now' />,
                  description: (
                      <Localize
                          i18n_default_text='If you want to become a payment agent, please fund your account with a minimun of <0/> USD to be eligible.'
                          components={[<Money key={0} amount={initial_deposit} />]}
                      />
                  ),
                  icon: 'IcAlertWarning',
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
                          components={[<Money key={0} amount={initial_deposit} />]}
                      />
                  ),
                  icon: 'IcCashierRedWarning',
                  is_primary_button: true,
                  onClick: () => history.push(routes.cashier_deposit),
                  title: <Localize i18n_default_text='Sign-up failed' />,
                  title_color: 'loss-danger',
              };
    } else if (is_rejcted && (needs_poi || needs_poa)) {
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
    } else if (locked_account) {
        return {
            button_text: <Localize i18n_default_text='Go to live chat' />,
            description: (
                <Localize i18n_default_text='It seems that certain actions are restricted on your account. Please contact us via live chat to resolve this issue.' />
            ),
            icon: 'IcAlertWarning',
            is_primary_light_button: true,
            onClick: () => window.LC_API.open_chat_window(),
            title: <Localize i18n_default_text='Your account is locked' />,
            title_color: 'warning',
        };
    } else if (can_apply_to_be_a_payment_agent && is_rejcted) {
        return {
            button_text: <Localize i18n_default_text='Submit again' />,
            description: (
                <Localize i18n_default_text="Thank you for making the deposit. You've met the minimum required account balance for us to continue with the review." />
            ),
            icon: 'IcCheckmarkCircle',
            icon_color: 'var(--status-success)',
            is_primary_light_button: true,
            // onClick: () => window.LC_API.open_chat_window(),send paymentagent_create request with all data received from paymentagent_details
            title: <Localize i18n_default_text='Your application is back in review' />,
            title_color: 'profit-success',
        };
    } else if (is_applied) {
        return {
            description: (
                <Localize
                    i18n_default_text="We're reviewing your information. In the meantime, please ensure you have a minimum balance of <0/> USD in your account. Otherwise, you'll have to resubmit your application."
                    components={[<Money key={0} amount={initial_deposit} />]}
                />
            ),
            icon: 'IcAlertWarning',
            title: <Localize i18n_default_text='Application under review' />,
            title_color: 'warning',
        };
    } else if (is_authorized || is_verified) {
        return {
            description: (
                <Localize i18n_default_text='Congratulations! Your application to be a payment agent on Deriv is approved and now you are ready to begin.' />
            ),
            icon: 'IcAlertSuccess',
            title: <Localize i18n_default_text='Success' />,
            title_color: 'profit-success',
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
        is_primary_button: true,
        onClick: () => openWizard(),
        tip: (
            <Localize
                i18n_default_text='Note: If your account balance falls below <0/> USD, you’ll need to resubmit your application.'
                components={[<Money key={0} amount={initial_deposit} />]}
            />
        ),
        title: <Localize i18n_default_text='Want to become a payment agent?' />,
        title_color: 'prominent',
    };
};

export default getNote;
