import React from 'react';
import { observer } from 'mobx-react-lite';
import { ProofOfIdentityContainerForPaymentAgent } from '@deriv/account';
import { Text, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { TStepsState } from '../steps-reducer';
import './identity-verification.scss';

type TIdentityVerification = {
    idv_data: TStepsState['idv_data'];
    manual_data: TStepsState['manual_data'];
    selected_country: TStepsState['selected_country'];
    selected_manual_document_index: string;
    setIDVData: (value: TStepsState['idv_data']) => void;
    setIsIdentitySubmissionDisabled: (value: boolean) => void;
    setManualData: (value: TStepsState['manual_data']) => void;
    setSelectedManualDocumentIndex: (value: string) => void;
};

const IdentityVerification = ({
    idv_data,
    manual_data,
    selected_country,
    selected_manual_document_index,
    setIDVData,
    setIsIdentitySubmissionDisabled,
    setManualData,
    setSelectedManualDocumentIndex,
}: TIdentityVerification) => {
    const {
        client,
        notifications: { refreshNotifications },
    } = useStore();

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

    const is_idv_supported = selected_country?.identity?.services?.idv?.is_country_supported;

    // reset IDV form if the user selects another country with IDV verification, if not we store IDV data for previous selected country
    React.useEffect(() => {
        if (is_idv_supported) {
            // eslint-disable-next-line no-unused-expressions
            selected_country?.value !== idv_data.country_code &&
                setIDVData({
                    values: {
                        document_type: {
                            id: '',
                            text: '',
                            value: '',
                            example_format: '',
                            sample_image: '',
                        },
                        document_number: '',
                    },
                    errors: {},
                });
        }
    }, [selected_country, idv_data.country_code, is_idv_supported, setIDVData]);

    React.useEffect(() => {
        if (onfido_status !== 'none') setIsIdentitySubmissionDisabled(false);

        return () => setIsIdentitySubmissionDisabled(true);
    }, [onfido_status, setIsIdentitySubmissionDisabled]);

    return (
        <div className='pa-signup-poi-container'>
            <DesktopWrapper>
                <Text as='h2' size='m' weight='bold' line-height='m' className='pa-signup-poi-container__header'>
                    {localize('Identity verification')}
                </Text>
            </DesktopWrapper>
            <ProofOfIdentityContainerForPaymentAgent
                account_status={account_status}
                height='auto'
                idv_data={idv_data}
                is_from_external
                manual_data={manual_data}
                refreshNotifications={refreshNotifications}
                selected_country={selected_country}
                setIDVData={setIDVData}
                setManualData={setManualData}
                setSelectedManualDocumentIndex={setSelectedManualDocumentIndex}
                selected_manual_document_index={selected_manual_document_index}
            />
        </div>
    );
};

export default observer(IdentityVerification);
