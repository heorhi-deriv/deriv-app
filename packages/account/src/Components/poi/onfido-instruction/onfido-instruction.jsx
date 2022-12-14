import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const DocumentTypeSelect = () => {
    return (
        <>
            <Text as='p' size='xs' line-height='m'>
                <Localize i18n_default_text="First, we'll need to verify your identity. Choose your preferred document for submission." />
            </Text>
            <Text as='p' size='xs' line-height='m' color='less-prominent'>
                <Localize
                    i18n_default_text='Note: Please ensure all your <0>personal details</0> are up-to-date before uploading the photo of your document.'
                    components={[<Text key={0} size='xs' weight='bold' color='less-prominent' />]}
                />
            </Text>
        </>
    );
};

const DocumentCaptureFront = () => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize i18n_default_text='Please upload your latest document photo to verify your identity. Optionally, you can take an instant photo of your document via your mobile.' />
        </Text>
    );
};

const DocumentCaptureConfirmationFront = () => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize i18n_default_text="Now, upload the document front photo and ensure it's in colour, clear, and not cropped." />
        </Text>
    );
};

const DocumentCaptureConfirmationBack = () => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize i18n_default_text="Next, upload the document back photo and ensure it's in colour, clear, and not cropped. You may also upload the photo via your mobile." />
        </Text>
    );
};

const FacialCapture = () => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize i18n_default_text='Next, we need you to complete the face verification. Position your face inside the frame. Do not wear hats or glasses and avoid using filters when taking your selfie.' />
        </Text>
    );
};

const FacialCaptureConfirmation = () => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize i18n_default_text='Please take a clear selfie with your entire face in the frame and check your selfie before uploading.' />
        </Text>
    );
};

const Instruction = ({ setIsOnfidoLoading }) => {
    const [onfido_event_name, setOnfidoEventName] = React.useState('');

    React.useEffect(() => {
        if (['DOCUMENT_TYPE_SELECT', 'DOCUMENT_CAPTURE_FRONT'].includes(onfido_event_name)) setIsOnfidoLoading(false);

        if (onfido_event_name === 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT') {
            const onfido_back_btn = document.querySelector('.onfido-sdk-ui-NavigationBar-back');
            onfido_back_btn?.addEventListener(
                'click',
                () => {
                    setOnfidoEventName('DOCUMENT_CAPTURE_FRONT');
                },
                { once: true }
            );
        }
    }, [onfido_event_name, setIsOnfidoLoading]);

    React.useEffect(() => {
        const changeEventName = event => setOnfidoEventName(event.detail.eventName);

        window.addEventListener('userAnalyticsEvent', changeEventName);

        return () => {
            window.removeEventListener('userAnalyticsEvent', changeEventName);
        };
    }, []);

    if (onfido_event_name === 'DOCUMENT_TYPE_SELECT') {
        return <DocumentTypeSelect />;
    }
    if (['DOCUMENT_CAPTURE_FRONT', 'CROSS_DEVICE_INTRO', 'CROSS_DEVICE_GET_LINK'].includes(onfido_event_name)) {
        return <DocumentCaptureFront />;
    }
    if (onfido_event_name === 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT') {
        return <DocumentCaptureConfirmationFront />;
    }
    if (['DOCUMENT_CAPTURE_BACK', 'DOCUMENT_CAPTURE_CONFIRMATION_BACK'].includes(onfido_event_name)) {
        return <DocumentCaptureConfirmationBack />;
    }
    if (['FACIAL_INTRO', 'FACIAL_CAPTURE'].includes(onfido_event_name)) {
        return <FacialCapture />;
    }
    if (onfido_event_name === 'FACIAL_CAPTURE_CONFIRMATION') {
        return <FacialCaptureConfirmation />;
    }

    return null;
};

const OnfidoInstruction = ({ setIsOnfidoLoading }) => {
    return (
        <div className='onfido-instruction__instruction'>
            <Instruction setIsOnfidoLoading={setIsOnfidoLoading} />
        </div>
    );
};

export default React.memo(OnfidoInstruction);
