import React from 'react';
import { Text, DesktopWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ProofOfAddress from '../../proof-of-address';

const ProofOfAddressStep = () => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <Text as='p' size='m' line-height='m' weight='bold'>
                    <Localize i18n_default_text='Address verification' />
                </Text>
            </DesktopWrapper>
            <Text as='p' size='xs' line-height='m' className='pa-signup-wizard__step-text'>
                <Localize i18n_default_text="Next, we'll need to verify your address. Fill in your complete and correct address details." />
            </Text>
            <Text as='p' size='xs' color='less-prominent' line-height='m' className='pa-signup-wizard__step-hint'>
                <Localize i18n_default_text='Note: An accurate and complete address helps to speed up your verification process.' />
            </Text>
            <ProofOfAddress />
        </React.Fragment>
    );
};

export default ProofOfAddressStep;
