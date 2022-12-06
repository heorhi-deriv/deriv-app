import React from 'react';
import { observer } from 'mobx-react-lite';
import { ProofOfIdentityContainerForPaymentAgent } from '@deriv/account';
import { Text, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '../../../../../hooks';
import { TStepsState } from '../steps-reducer';
import './identity-verification.scss';

type TIdentityVerification = {
    idv_values: TStepsState['idv_data']['values'];
    manual_values: TStepsState['manual_data']['values'];
    selected_country: TStepsState['selected_country'];
    selected_manual_document_index: string;
    setIDVData: (value: TStepsState['idv_data']) => void;
    setIsIdentitySubmissionDisabled: (value: boolean) => void;
    setManualData: (value: TStepsState['manual_data']) => void;
    setSelectedManualDocumentIndex: (value: string) => void;
};

const IdentityVerification = ({
    idv_values,
    manual_values,
    selected_country,
    selected_manual_document_index,
    setIDVData,
    setIsIdentitySubmissionDisabled,
    setManualData,
    setSelectedManualDocumentIndex,
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
                idv_values={idv_values}
                is_from_external
                manual_values={manual_values}
                refreshNotifications={refreshNotifications}
                selected_country={selected_country}
                setIDVData={setIDVData}
                setManualData={setManualData}
                setSelectedManualDocumentIndex={setSelectedManualDocumentIndex}
                selected_manual_document_index={selected_manual_document_index}
            />
        </>
    );
};

export default observer(IdentityVerification);
