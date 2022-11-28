import React from 'react';
import { SelfieUpload } from '@deriv/account';
import { setSelfie, setSelfieStepEnabled, TActionsTypes } from '../../signup-wizard/steps-reducer';
import './selfie.scss';

type TSelfieError = {
    code: string;
    message: string;
};

type TSelfieFile = {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    path: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

export type TSelfie = {
    document_type: string;
    errors: TSelfieError[] | [];
    file: TSelfieFile;
    icon: string;
    info: string;
    name: string;
    pageType: string;
};

type TSelfieStep = {
    selfie: { selfie_with_id: TSelfie } | null;
    dispatch: React.Dispatch<TActionsTypes>;
};

const SelfieStep = ({ selfie, dispatch }: TSelfieStep) => {
    const onFileDrop = (value: TSelfie) => dispatch(setSelfie({ selfie_with_id: value }));

    //TODO: change the description for the selfie depending on the step number
    return (
        <SelfieUpload
            initial_values={selfie}
            is_pa_signup
            onFileDrop={onFileDrop}
            dispatch={dispatch}
            setSelfieStepEnabled={setSelfieStepEnabled}
        />
    );
};

export default React.memo(SelfieStep);
