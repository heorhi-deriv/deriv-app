import React from 'react';
import { Dialog, Text, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getProvider } from './provider';
import './application-status-dialog.scss';

type TApplicationStatusDialogProps = {
    is_visible: boolean;
    status: string;
    onClose: () => void;
    onButtonClick?: () => void;
};

const ApplicationStatusDialog = ({ is_visible, onClose, status, onButtonClick }: TApplicationStatusDialogProps) => {
    const content = getProvider(status);

    return (
        <Dialog
            className='pa-application-status-dialog'
            is_visible={is_visible}
            has_close_icon={true}
            width='384px'
            onClose={onClose}
        >
            {content && (
                <React.Fragment>
                    <div className='pa-application-status-dialog__icon'>{content.icon}</div>
                    <div>
                        {content.title && (
                            <Text
                                as='h2'
                                weight='bold'
                                size='s'
                                align='center'
                                className='pa-application-status-dialog__title'
                            >
                                <Localize i18n_default_text={content.title} />
                            </Text>
                        )}
                        {content.text && (
                            <Text as='p' size='xs' align='center' className='pa-application-status-dialog__text'>
                                <Localize i18n_default_text={content.text} />
                            </Text>
                        )}
                        {content.hint && (
                            <Text as='p' size='xxs' align='center' className='pa-application-status-dialog__hint'>
                                <Localize i18n_default_text={content.hint} />
                            </Text>
                        )}
                        {onButtonClick && content.button && (
                            <Button text={localize(content.button)} onClick={onButtonClick} primary large />
                        )}
                    </div>
                </React.Fragment>
            )}
        </Dialog>
    );
};

export default ApplicationStatusDialog;
