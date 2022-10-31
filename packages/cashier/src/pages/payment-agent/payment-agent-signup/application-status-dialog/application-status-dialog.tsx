import React from 'react';
import { Icon, Dialog, Text, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './application-status-dialog.scss';

type TApplicationStatusDialogProps = {
    is_visible: boolean;
    status: string;
    onClose: () => void;
    onButtonClick?: () => void;
};

const provider = {
    success: {
        icon: <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' size={72} />,
        title: 'Application successfully submitted',
        text: (
            <Localize
                i18n_default_text='You will receive an email about your application status within 3 working days. Please notice, If your <0>account balance goes under 3,000.00 USD</0>, you will need to submit your application again.'
                components={[
                    <Text key={0} weight='bold' as='span' size='xs' className='pa-application-status-dialog__note' />,
                ]}
            />
        ),
        hint: null,
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

const ApplicationStatusDialog = ({ is_visible, onClose, status, onButtonClick }: TApplicationStatusDialogProps) => {
    const StatusIcon = () => provider[status as keyof typeof provider].icon;

    return (
        <Dialog
            className='pa-application-status-dialog'
            is_visible={is_visible}
            has_close_icon={true}
            width='384px'
            onClose={onClose}
        >
            {StatusIcon && (
                <div className='pa-application-status-dialog__icon'>
                    <StatusIcon />
                </div>
            )}
            <div>
                {provider[status as keyof typeof provider].title && (
                    <Text as='h2' weight='bold' size='s' align='center' className='pa-application-status-dialog__title'>
                        <Localize i18n_default_text={provider[status as keyof typeof provider].title} />
                    </Text>
                )}
                {provider[status as keyof typeof provider].text && (
                    <Text as='p' size='xs' align='center' className='pa-application-status-dialog__text'>
                        <Localize i18n_default_text={provider[status as keyof typeof provider].text} />
                    </Text>
                )}
                {provider[status as keyof typeof provider].hint && (
                    <Text as='p' size='xxs' align='center' className='pa-application-status-dialog__hint'>
                        <Localize i18n_default_text={provider[status as keyof typeof provider].hint} />
                    </Text>
                )}
                {onButtonClick && provider[status as keyof typeof provider].button && (
                    <Button
                        text={localize(provider[status as keyof typeof provider].button)}
                        onClick={onButtonClick}
                        primary
                        large
                    />
                )}
            </div>
        </Dialog>
    );
};

export default ApplicationStatusDialog;
