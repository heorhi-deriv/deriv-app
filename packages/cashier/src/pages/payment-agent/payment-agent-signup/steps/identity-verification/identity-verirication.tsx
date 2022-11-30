import React from 'react';
import { observer } from 'mobx-react-lite';
import { ResidenceList } from '@deriv/api-types';
import { Text, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '../../../../../hooks';
import { ProofOfIdentityContainerForPaymentAgent } from '@deriv/account';
import './identity-verification.scss';

type TIdentityVerification = {
    selected_country: ResidenceList[number];
};

const IdentityVerification = ({ selected_country }: TIdentityVerification) => {
    const { client, notifications } = useStore();

    const { account_status } = client;
    const { refreshNotifications } = notifications;

    return (
        <>
            <DesktopWrapper>
                <Text
                    as='h2'
                    size='m'
                    weight='bold'
                    line-height='m'
                    className='payment-agent-poi__onfido-instruction__header'
                >
                    {localize('Identity verification')}
                </Text>
            </DesktopWrapper>
            <ProofOfIdentityContainerForPaymentAgent
                account_status={account_status}
                height='auto'
                is_from_external
                refreshNotifications={refreshNotifications}
                selected_country={selected_country}
            />
        </>
    );
};

export default observer(IdentityVerification);
