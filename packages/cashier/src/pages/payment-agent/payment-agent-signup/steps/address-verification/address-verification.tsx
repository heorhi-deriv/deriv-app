import React from 'react';
import { Text, DesktopWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ProofOfAddressForm from './proof-of-address-form';
import type { TPOAFormValues } from './proof-of-address-form/proof-of-address-form';

type TAddressVerificationProps = {
    onSelect: React.ComponentProps<typeof ProofOfAddressForm>['onSelect'];
    selected_country_id: string;
    address?: TPOAFormValues;
};

const AddressVerification = ({ onSelect, address, selected_country_id }: TAddressVerificationProps) => {
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
            <ProofOfAddressForm selected_country_id={selected_country_id} address={address} onSelect={onSelect} />
        </React.Fragment>
    );
};

export default AddressVerification;
