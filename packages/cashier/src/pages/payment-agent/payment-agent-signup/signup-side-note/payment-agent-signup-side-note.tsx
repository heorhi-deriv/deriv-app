import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import getMessage from './payment-agent-side-note-provider';
import { useHistory } from 'react-router';
import './payment-agent-signup-side-note.scss';

const PaymentAgentSignupSideNote = () => {
    const history = useHistory();
    const note = getMessage(history);

    return (
        <div className='payment-agent-signup-side-note'>
            <div className='payment-agent-signup-side-note__header'>
                {note.icon && <Icon icon={note.icon} size={16} />}
                <Text as='p' color={note.title_color} size='xxs' line-height='m' weight='bold'>
                    {note.title}
                </Text>
            </div>
            <Text as='p' className='payment-agent-signup-side-note__description' size='xxxs' line-height='s'>
                {note.description}
            </Text>
            {note.button_text && (
                <div>
                    {note.has_attempts_hint && (
                        <Text as='p' color='less-prominent' size='xxxs' line-height='s'>
                            <Localize i18n_default_text='3 attempts remaining' />
                        </Text>
                    )}
                    {note.button_text && (
                        <Button
                            type='button'
                            primary={note.is_primary_button}
                            primary_light={note.is_primary_light_button}
                            small
                            onClick={note.onClick}
                        >
                            {note.button_text}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentAgentSignupSideNote;
