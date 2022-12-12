import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DetailComponent from './detail-component.jsx';
import { getDocumentIndex } from './constants';
import DocumentSelector from './document-selector';

export const UnsupportedForPA = ({
    country_code,
    handlePOIforMT5Complete,
    setSelectedManualDocumentIndex,
    selected_manual_document_index,
    setManualData,
    ...props
}) => {
    const [document_index, setDocumentIndex] = React.useState(selected_manual_document_index);
    const documents = React.useMemo(() => getDocumentIndex({ country_code }), [country_code]);

    const changeDocument = React.useCallback(
        e => {
            setManualData({ values: {}, errors: {} });
            setDocumentIndex(e.target.value);
            setSelectedManualDocumentIndex(e.target.value);
        },
        [setSelectedManualDocumentIndex, setManualData]
    );

    return (
        <>
            <Text as='p' size='xs' line-height='m' className='unsupported-pa__header'>
                <Localize i18n_default_text="First, we'll need to verify your identity. Choose your preferred document photo for verification." />
            </Text>
            <Text as='p' size='xs' line-height='m' color='less-prominent' className='unsupported-pa__header-note'>
                <Localize i18n_default_text='Note: Please ensure all your personal details are up-to-date before uploading the photo of your document.' />
            </Text>
            <DocumentSelector country_code={country_code} onChange={changeDocument} document_index={document_index} />
            {document_index && (
                <DetailComponent
                    is_onfido_supported={false}
                    country_code={country_code}
                    document={documents[document_index]}
                    root_class='manual-poi'
                    handlePOIforMT5Complete={handlePOIforMT5Complete}
                    setManualData={setManualData}
                    {...props}
                />
            )}
        </>
    );
};
