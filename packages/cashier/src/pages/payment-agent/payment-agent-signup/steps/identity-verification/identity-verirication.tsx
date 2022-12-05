import React from 'react';
import { observer } from 'mobx-react-lite';
import { ProofOfIdentityContainerForPaymentAgent } from '@deriv/account';
import { Text, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '../../../../../hooks';
import { TStepsState } from '../steps-reducer';
import './identity-verification.scss';

type TIdentityVerification = {
    selected_country: TStepsState['selected_country'];
    setIDVData: (value: TStepsState['idv_data']) => void;
    setManualData: (value: TStepsState['manual_data']) => void;
    setIsIdentitySubmissionDisabled: (value: boolean) => void;
};

const IdentityVerification = ({
    selected_country,
    setIDVData,
    setManualData,
    setIsIdentitySubmissionDisabled,
}: TIdentityVerification) => {
    const { client, notifications } = useStore();

    const { account_status } = client;
    const {
        authentication: {
            identity: {
                services: {
                    onfido: { status: onfido_status },
                },
            },
        },
    } = account_status;
    const { refreshNotifications } = notifications;

    React.useEffect(() => {
        if (onfido_status !== 'none') setIsIdentitySubmissionDisabled(false);
    }, [onfido_status, setIsIdentitySubmissionDisabled]);

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
                setIDVData={setIDVData}
                setManualData={setManualData}
            />
        </>
    );
};

export default observer(IdentityVerification);
