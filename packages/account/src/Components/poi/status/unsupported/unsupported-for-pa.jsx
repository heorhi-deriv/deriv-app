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

export const UnsupportedForPA = ({ country_code, handlePOIforMT5Complete, ...props }) => {
    const [selected_document_index, setSelectedDocumentIndex] = React.useState(null);
    const documents = getDocumentIndex({ country_code });

    const changeDocument = React.useCallback(e => {
        setSelectedDocumentIndex(e.target.value);
    }, []);

    return (
        <>
            <DocumentSelector
                country_code={country_code}
                onChange={changeDocument}
                selected_document_index={selected_document_index}
            />
            {selected_document_index && (
                <DetailComponent
                    is_onfido_supported={
                        country_code === 'ng' && !checkNimcStep(documents[selected_document_index].details.documents)
                    }
                    country_code={country_code}
                    document={documents[selected_document_index]}
                    root_class='manual-poi'
                    handlePOIforMT5Complete={handlePOIforMT5Complete}
                    selected_document_index={selected_document_index}
                    {...props}
                />
            )}
        </>
    );
};
