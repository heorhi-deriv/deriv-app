import React from 'react';
import { SelfieUpload } from '@deriv/account';
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
    onSelect: (value: { selfie_with_id: TSelfie }) => void;
};

const SelfieStep = ({ selfie, onSelect }: TSelfieStep) => {
    //TODO: change the description for the selfie depending on the step number
    return <SelfieUpload initial_values={selfie} is_pa_signup onFileDrop={onSelect} />;
};

export default SelfieStep;
