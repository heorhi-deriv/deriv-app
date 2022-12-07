import React from 'react';
import DetailComponent from './detail-component.jsx';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';
import DocumentSelector from './document-selector';

const checkNimcStep = documents => {
    let has_nimc = false;
    documents.forEach(document => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

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
            <DocumentSelector country_code={country_code} onChange={changeDocument} document_index={document_index} />
            {document_index && (
                <DetailComponent
                    is_onfido_supported={
                        country_code === 'ng' && !checkNimcStep(documents[document_index].details.documents)
                    }
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
