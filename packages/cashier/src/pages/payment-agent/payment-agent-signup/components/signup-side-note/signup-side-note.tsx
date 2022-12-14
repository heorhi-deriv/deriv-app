import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Text } from '@deriv/components';
import getNote from './signup-side-note-provider';
import { useHistory } from 'react-router';
import { useStore } from '@deriv/stores';
import SignupWizard from '../../signup-wizard';
import './signup-side-note.scss';

export type TNote = {
    button_text?: JSX.Element;
    description: JSX.Element;
    icon?: string;
    icon_color?: string;
    is_primary_button?: boolean;
    is_primary_light_button?: boolean;
    onClick?: VoidFunction;
    tip?: JSX.Element;
    title: JSX.Element;
    title_color?: string;
};

const Note = ({ note }: { note: TNote }) => {
    return (
        <div className='signup-side-note'>
            <div className='signup-side-note__header'>
                {note.icon && <Icon icon={note.icon} size={16} custom_color={note.icon_color} />}
                <Text as='p' color={note.title_color} size='xs' line-height='m' weight='bold'>
                    {note.title}
                </Text>
            </div>
            <Text as='p' className='signup-side-note__description' size='xxs' line-height='s'>
                {note.description}
            </Text>
            {note.tip && (
                <Text as='p' className='signup-side-note__tip' size='xxs' line-height='s'>
                    {note.tip}
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
    );
};

const SignupSideNote = () => {
    const history = useHistory();

    const [is_wizard_open, setIsWizardOpen] = React.useState(false);
    const [paymentagent_details, setPaymentAgentDetails] = React.useState({});

    const { client } = useStore();

    const {
        website_status: {
            payment_agents: { initial_deposit_per_country },
        },
        account_settings: { country_code },
        account_status,
    } = client;

    const closeWizard = () => {
        setIsWizardOpen(false);
    };

    const openWizard = () => {
        setIsWizardOpen(true);
    };

    const note = React.useMemo(
        () => getNote({ country_code, history, initial_deposit_per_country, openWizard, paymentagent_details }),
        [history, paymentagent_details, country_code, initial_deposit_per_country]
    );

    return (
        <>
            <Note note={note} />
            {is_wizard_open && <SignupWizard closeWizard={closeWizard} account_status={account_status} />}
        </>
    );
};

export default observer(SignupSideNote);
