import React from 'react';
import { Popover, Text } from '@deriv/components';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
};

const QSInputLabel: React.FC<TQSInputLabel> = ({ label, description }) => {
    return (
        <div className='ssb-add__form__field'>
            <div className='ssb-add__input-label'>
                <Text weight='bold' className='ssb-add__input-label__wrapper' size='xs'>
                    {label}
                </Text>
                <span>
                    <Popover message={description} zIndex='9999' alignment='top' icon='info' />
                </span>
            </div>
        </div>
    );
};

export default QSInputLabel;
