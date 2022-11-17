import React from 'react';
import { SelfieUpload } from '@deriv/account';
import './selfie.scss';

type TSelfieStep = {
    setIsSelfieStepEnabled: (value: boolean) => void;
};

const SelfieStep = ({ setIsSelfieStepEnabled }: TSelfieStep) => {
    const [selfie, setSelfie] = React.useState();

    const onFileDrop = value => setSelfie({ selfie_with_id: value });

    return (
        <>
            <SelfieUpload
                initial_values={selfie}
                is_pa_signup
                onFileDrop={onFileDrop}
                setIsSelfieStepEnabled={setIsSelfieStepEnabled}
            />
        </>
    );
};

export default SelfieStep;
