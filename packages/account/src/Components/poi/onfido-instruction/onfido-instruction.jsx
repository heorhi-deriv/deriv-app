import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const DocumentTypeSelect = () => {
    return (
        <>
            <Text as='p' size='xs' line-height='m'>
                <Localize i18n_default_text="First, we'll need to verify your identity. Choose your preferred document for submission." />
            </Text>
            <Text as='p' size='xs' line-height='m'>
                <Localize
                    i18n_default_text='Note: Please ensure all your <0>personal details</0> are up-to-date before uploading the photo of your document.'
                    components={[<Text key={0} size='xs' weight='bold' />]}
                />
            </Text>
        </>
    );
};

const DocumentCaptureFront = ({ document_type }) => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize
                i18n_default_text='Please upload your latest {{document_type}} photo to verify your identity. Optionally, you can take an instant photo of your {{document_type}} via your mobile.'
                values={{ document_type }}
            />
        </Text>
    );
};

const DocumentCaptureConfirmationFront = ({ document_type }) => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize
                i18n_default_text="Now, upload the {{document_type}} front photo and ensure it's in colour, clear, and not cropped."
                values={{ document_type }}
            />
        </Text>
    );
};

const DocumentCaptureConfirmationBack = ({ document_type }) => {
    return (
        <Text as='p' size='xs' line-height='m'>
            <Localize
                i18n_default_text="Next, upload the {{document_type}} back photo and ensure it's in colour, clear, and not cropped. You may also upload the photo via your mobile."
                values={{ document_type }}
            />
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
    const [document_type, setDocumentType] = React.useState('document');

    const passport_btn_ref = React.useRef(null);
    const driving_licence_btn_ref = React.useRef(null);
    const national_identity_card_ref = React.useRef(null);

    const changeInstruction = React.useCallback(
        event => {
            switch (event.detail.eventName) {
                case 'DOCUMENT_TYPE_SELECT': {
                    setInstruction(<DocumentTypeSelect />);
                    setIsOnfidoLoading(false);
                    passport_btn_ref.current = document.querySelector(['[data-onfido-qa="passport"]']);
                    driving_licence_btn_ref.current = document.querySelector(['[data-onfido-qa="driving_licence"]']);
                    national_identity_card_ref.current = document.querySelector([
                        '[data-onfido-qa="national_identity_card"]',
                    ]);
                    passport_btn_ref.current?.addEventListener('click', () => setDocumentType('passport'));
                    driving_licence_btn_ref.current?.addEventListener('click', () =>
                        setDocumentType('driver’s license')
                    );
                    national_identity_card_ref.current?.addEventListener('click', () =>
                        setDocumentType('identity card')
                    );
                    break;
                }
                case 'DOCUMENT_CAPTURE_FRONT': {
                    setInstruction(<DocumentCaptureFront document_type={document_type} />);
                    setIsOnfidoLoading(false);
                    break;
                }
                case 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT': {
                    setInstruction(<DocumentCaptureConfirmationFront document_type={document_type} />);
                    break;
                }
                case 'DOCUMENT_CAPTURE_BACK':
                case 'DOCUMENT_CAPTURE_CONFIRMATION_BACK': {
                    setInstruction(<DocumentCaptureConfirmationBack document_type={document_type} />);
                    break;
                }
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
        [document_type, setIsOnfidoLoading]
    );

    React.useEffect(() => {
        window.addEventListener('userAnalyticsEvent', changeInstruction);

        return () => {
            window.removeEventListener('userAnalyticsEvent', changeInstruction);
            passport_btn_ref.current?.removeEventListener('click', () => setDocumentType('passport'));
            driving_licence_btn_ref.current?.removeEventListener('click', () => setDocumentType("driver's license"));
            national_identity_card_ref.current?.removeEventListener('click', () => setDocumentType('identity card'));
        };
    }, [changeInstruction]);

    return <div className='payment-agent-poi__onfido-instruction__instruction'>{instruction}</div>;
};

export default React.memo(OnfidoInstruction);
