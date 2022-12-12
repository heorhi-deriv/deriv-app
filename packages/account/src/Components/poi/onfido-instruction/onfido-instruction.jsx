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

const OnfidoInstruction = ({ setIsOnfidoLoading }) => {
    const [instruction, setInstruction] = React.useState(null);

    const changeInstruction = React.useCallback(
        event => {
            switch (event.detail.eventName) {
                case 'DOCUMENT_TYPE_SELECT': {
                    setInstruction(<DocumentTypeSelect />);
                    setIsOnfidoLoading(false);
                    break;
                }
                case 'DOCUMENT_CAPTURE_FRONT': {
                    setInstruction(<DocumentCaptureFront />);
                    setIsOnfidoLoading(false);
                    break;
                }
                case 'CROSS_DEVICE_INTRO':
                case 'CROSS_DEVICE_GET_LINK': {
                    setInstruction(<DocumentCaptureFront />);
                    break;
                }
                case 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT': {
                    const onfido_back_btn = document.querySelector('.onfido-sdk-ui-NavigationBar-back');
                    onfido_back_btn?.addEventListener(
                        'click',
                        () => {
                            setInstruction(<DocumentCaptureFront />);
                        },
                        { once: true }
                    );
                    setInstruction(<DocumentCaptureConfirmationFront />);
                    break;
                }
                case 'DOCUMENT_CAPTURE_BACK':
                case 'DOCUMENT_CAPTURE_CONFIRMATION_BACK': {
                    setInstruction(<DocumentCaptureConfirmationBack />);
                    break;
                }
                case 'FACIAL_INTRO':
                case 'FACIAL_CAPTURE': {
                    setInstruction(<FacialCapture />);
                    break;
                }
                case 'FACIAL_CAPTURE_CONFIRMATION': {
                    setInstruction(<FacialCaptureConfirmation />);
                    break;
                }
                default:
                    setInstruction(null);
                    setIsOnfidoLoading(false);
            }
        },
        [setIsOnfidoLoading]
    );

    React.useEffect(() => {
        window.addEventListener('userAnalyticsEvent', changeInstruction);

        return () => {
            window.removeEventListener('userAnalyticsEvent', changeInstruction);
        };
    }, [changeInstruction]);

    React.useEffect(() => {}, []);

    return <div className='onfido-instruction__instruction'>{instruction}</div>;
};

export default React.memo(OnfidoInstruction);
