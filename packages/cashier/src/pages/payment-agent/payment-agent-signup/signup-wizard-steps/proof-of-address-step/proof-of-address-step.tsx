import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ProofOfAddress from '../../proof-of-address';

const ProofOfAddressStep = () => {
    return (
        <>
            <Text as='p' size='m' line-height='m' weight='bold'>
                <Localize i18n_default_text='Address verification' />
            </Text>
            <Text as='p' size='xs' line-height='m'>
                <Localize i18n_default_text="Next, we'll need to verify your address. Fill in your complete and correct address details. An accurate and complete address helps to speed up your verification process." />
            </Text>
            <ProofOfAddress />
        </>
    );
};

export default ProofOfAddressStep;
