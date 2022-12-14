import React from 'react';
import { SelfieUpload } from '@deriv/account';
import { DesktopWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
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
    idv_status: string;
    selfie: { selfie_with_id: TSelfie } | null;
    onSelect: (value: TSelfie) => void;
};

const Selfie = ({ idv_status, selfie, onSelect }: TSelfieStep) => {
    //TODO: change the description for the selfie depending on the step number
    return (
        <div className='pa-signup-selfie-container'>
            <DesktopWrapper>
                <Text as='h2' size='m' weight='bold' color='prominent'>
                    {localize('Selfie verification')}
                </Text>
            </DesktopWrapper>
            {idv_status === 'verified' ? (
                <Text as='p' size='xs' color='prominent'>
                    {localize("First, we'll need to verify your identity. Please upload your selfie here.")}
                </Text>
            ) : (
                <Text as='p' size='xs' color='prominent'>
                    {localize('Now, upload your selfie here.')}
                </Text>
            )}
            <SelfieUpload initial_values={selfie} is_pa_signup onFileDrop={onSelect} />
        </div>
    );
};

export default React.memo(Selfie);
