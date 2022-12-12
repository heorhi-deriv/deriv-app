import React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { GetAccountStatus } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { isEmptyObject, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Wizard } from '@deriv/ui';
import CancelWizardDialog from './components/cancel-wizard-dialog';
import ApplicationStatusDialog from './components/application-status-dialog';
import CountryOfIssue from './steps/country-of-issue';
import IdentityVerification from './steps/identity-verification';
import Selfie from './steps/selfie';
import { populateVerificationStatus } from './helpers/verification';
import { usePaymentAgentSignupReducer } from './steps/steps-reducer';
import './signup-wizard.scss';

type TSignupWizardProps = {
    account_status: GetAccountStatus;
    closeWizard: VoidFunction;
};

const SignupWizard = ({ account_status, closeWizard }: TSignupWizardProps) => {
    const [is_cancel_wizard_dialog_active, setIsCancelWizardDialogActive] = React.useState(false);
    const [is_application_status_dialog_active, setIsApplicationStatusDialogActive] = React.useState(false);
    const [current_step_key, setCurrentStepKey] = React.useState<string>();

    const {
        steps_state,
        setSelectedCountry,
        setSelectedManualDocumentIndex,
        setSelfie,
        setIDVData,
        setManualData,
        setIsIdentitySubmissionDisabled,
    } = usePaymentAgentSignupReducer();

    const is_final_step = current_step_key === 'complete_step';

    const wizard_root_el = document.getElementById('wizard_root');

    const verification_status = populateVerificationStatus(account_status);

    const { idv, manual, onfido } = verification_status;

    const onClose = () => {
        setIsCancelWizardDialogActive(true);
    };

    const onComplete = () => {
        //handle some logic
        closeWizard();
    };

    const onChangeStep = (_current_step: number, _current_step_key?: string) => {
        setCurrentStepKey(_current_step_key);
    };

    const is_idv_supported =
        !isEmptyObject(steps_state.selected_country) &&
        steps_state.selected_country.identity.services.idv.is_country_supported;

    // React.useEffect(() => {
    //     if (is_idv_supported && !['Country of issue', 'Identity verification'].includes(current_step_key)) {
    //         console.log('send idv');
    //         handleIdvSubmit();
    //     }
    // }, [is_idv_supported, current_step_key]);

    // const handleIdvSubmit = () => {
    //     const { document_number, document_type } = steps_state.idv_data.values;
    //     const submit_data = {
    //         identity_verification_document_add: 1,
    //         document_number,
    //         document_type: document_type.id,
    //         issuing_country: steps_state.selected_country?.value,
    //     };

    //     WS.send(submit_data).then(() => {
    //         WS.authorized.getAccountStatus();
    //     });
    // };

    if (wizard_root_el) {
        return createPortal(
            <>
                <CancelWizardDialog
                    is_visible={is_cancel_wizard_dialog_active}
                    onConfirm={() => closeWizard()}
                    onCancel={() => setIsCancelWizardDialogActive(false)}
                />
                {/* <ApplicationStatusDialog
                    is_visible={is_application_status_dialog_active}
                    onClose={() => {
                        setIsApplicationStatusDialogActive(false);
                        closeWizard();
                    }}
                    status='pending_before_poi'
                    onButtonClick={() => setIsApplicationStatusDialogActive(false)}
                /> */}
                <div
                    className={classNames('pa-signup-wizard', {
                        'pa-signup-wizard--is-cancel-dialog-active':
                            is_cancel_wizard_dialog_active || is_application_status_dialog_active,
                    })}
                >
                    <Wizard
                        has_dark_background
                        lock_final_step={false}
                        onClose={onClose}
                        onComplete={onComplete}
                        wizard_title={localize('Become a payment agent')}
                        primary_button_label={is_final_step ? localize('Submit') : localize('Next')}
                        secondary_button_label={localize('Back')}
                        onChangeStep={onChangeStep}
                    >
                        <Wizard.Step
                            title={localize('Country of issue')}
                            is_submit_disabled={!steps_state.selected_country?.value}
                            is_fullwidth
                            step_key='Country of issue'
                        >
                            <CountryOfIssue
                                selected_country={steps_state.selected_country}
                                onSelect={setSelectedCountry}
                            />
                        </Wizard.Step>
                        <Wizard.Step
                            title={localize('Identity verification')}
                            is_submit_disabled={steps_state.is_identity_submission_disabled}
                            is_fullwidth
                            step_key='Identity verification'
                        >
                            <IdentityVerification
                                idv_data={steps_state.idv_data}
                                manual_data={steps_state.manual_data}
                                selected_country={steps_state.selected_country}
                                selected_manual_document_index={steps_state.selected_manual_document_index}
                                setIDVData={setIDVData}
                                setIsIdentitySubmissionDisabled={setIsIdentitySubmissionDisabled}
                                setManualData={setManualData}
                                setSelectedManualDocumentIndex={setSelectedManualDocumentIndex}
                            />
                        </Wizard.Step>
                        <Wizard.Step
                            title={localize('Selfie verification')}
                            is_submit_disabled={!steps_state.selfie?.selfie_with_id}
                            is_fullwidth
                            step_key='Selfie verification'
                        >
                            <Selfie
                                is_idv_supported={!!is_idv_supported}
                                idv_status={idv.status}
                                selfie={steps_state.selfie}
                                onSelect={setSelfie}
                            />
                        </Wizard.Step>
                        <Wizard.Step step_key='complete_step' title='Step 3' is_fullwidth>
                            <>
                                <Text as='p' size='m' line-height='m' weight='bold'>
                                    <Localize i18n_default_text='Step 3: Payment agent details' />
                                </Text>
                                <Text as='p' size='xs' line-height='m'>
                                    <Localize i18n_default_text='Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.' />
                                </Text>
                            </>
                        </Wizard.Step>
                    </Wizard>
                </div>
            </>,
            wizard_root_el
        );
    }

    return null;
};

export default SignupWizard;
