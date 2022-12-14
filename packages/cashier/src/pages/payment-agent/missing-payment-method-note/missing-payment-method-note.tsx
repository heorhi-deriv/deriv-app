import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './missing-payment-method-note.scss';

const MissingPaymentMethodNote = () => {
    return (
        <Text as='p' size='xxs' lh='s'>
            <Localize i18n_default_text='Some payment methods may not be listed here but payment agents may still offer them. If you can’t find your favourite method, contact the payment agents directly to check further.' />
        </Text>
    );
};

export default MissingPaymentMethodNote;
