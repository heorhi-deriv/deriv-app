import React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { Wizard } from '@deriv/ui';
import CancelWizardDialog from '../cancel-wizard-dialog';
import SelectCountryStep from '../signup-wizard-steps/select-country-step';
import SelfieStep from '../signup-wizard-steps/selfie-step/selfie-step';
import { usePaymentAgentSignupReducer } from './steps-reducer';
import './signup-wizard.scss';

type TSignupWizardProps = {
    closeWizard: VoidFunction;
};

const SignupWizard = ({ closeWizard }: TSignupWizardProps) => {
    const [is_cancel_wizard_dialog_active, setIsCancelWizardDialogActive] = React.useState(false);
    const [current_step_key, setCurrentStepKey] = React.useState<string>();

    const { steps_state, setSelectedCountry, setSelfie } = usePaymentAgentSignupReducer();

    const is_final_step = current_step_key === 'complete_step';

    const wizard_root_el = document.getElementById('wizard_root');

    const onClose = () => {
        setIsCancelWizardDialogActive(true);
    };

    const onComplete = () => {
        //handle some logic
        closeWizard();
    };

    const onSelfieSelect: React.ComponentProps<typeof SelfieStep>['onSelect'] = selfie => {
        setSelfie({ selfie_with_id: selfie });
    };

    const onChangeStep = (_current_step: number, _current_step_key?: string) => {
        setCurrentStepKey(_current_step_key);
    };

    if (wizard_root_el) {
        return createPortal(
            <>
                <CancelWizardDialog
                    is_visible={is_cancel_wizard_dialog_active}
                    onConfirm={() => closeWizard()}
                    onCancel={() => setIsCancelWizardDialogActive(false)}
                />
                <div
                    className={classNames('pa-signup-wizard', {
                        'pa-signup-wizard--is-cancel-dialog-active': is_cancel_wizard_dialog_active,
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
                            is_submit_disabled={!steps_state.selected_country}
                            is_fullwidth
                        >
                            <SelectCountryStep
                                selected_country={steps_state.selected_country}
                                dispatch={setSelectedCountry}
                            />
                        </Wizard.Step>
                        <Wizard.Step
                            title={localize('Selfie verification')}
                            is_submit_disabled={!steps_state.selfie?.selfie_with_id}
                            is_fullwidth
                        >
                            <SelfieStep selfie={steps_state.selfie} onSelect={onSelfieSelect} />
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
