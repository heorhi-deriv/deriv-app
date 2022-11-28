import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TProvider = {
    [k: string]: {
        icon: JSX.Element;
        title: string;
        text: JSX.Element;
        hint: JSX.Element | null;
        button: string | null;
    };
};

const provider: TProvider = {
    success: {
        icon: <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' size={72} />,
        title: "We've received your application.",
        text: (
            <Localize i18n_default_text='We will notify you via email about the status of your application within 3 working days.' />
        ),
        hint: (
            <Localize i18n_default_text='Note: If your account balance falls below 3,000.00 USD, you’ll need to resubmit your application.' />
        ),
        button: null,
    },
    pending_before_poi: {
        icon: <Icon icon='IcDocsSubmit' size={72} />,
        title: 'Documents pending for review',
        text: (
            <Localize i18n_default_text='We are still processing your details. In the meantime, please continue to provide your Proof of Address, selfie, and PA information.' />
        ),
        hint: null,
        button: 'Continue',
    },
    pending_after_poi: {
        icon: <Icon icon='IcDocsSubmit' size={72} />,
        title: 'Documents pending for review',
        text: (
            <Localize i18n_default_text='We are still processing your details. You will receive an email about your application status within 3 working days. ' />
        ),
        hint: null,
        button: null,
    },
    failed_first_attempt: {
        icon: <Icon icon='IcPoiError' size={72} />,
        title: 'ID verification failed',
        text: (
            <Localize i18n_default_text='We were unable to verify your ID due to external technical issues. Please try again.' />
        ),
        hint: null,
        button: 'Try again',
    },
    failed_second_attempt: {
        icon: <Icon icon='IcPoiError' size={72} />,
        title: 'ID verification failed',
        text: (
            <Localize i18n_default_text='We were unable to verify your ID due to external technical issues. Please continue to try another verification process.' />
        ),
        hint: null,
        button: 'Continue',
    },
};

const getProvider = (status: string) => {
    if (!status || status === '') return null;

    return provider[status];
};

export { getProvider };
