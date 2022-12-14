import React from 'react';
import POISubmissionForPaymentAgent from './proof-of-identity-submission-for-payment-agent.jsx';
import { service_code } from './proof-of-identity-utils';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainerForPaymentAgent = ({
    account_status,
    height,
    idv_data,
    is_from_external,
    manual_data,
    // onStateChange,
    refreshNotifications,
    selected_country,
    setIDVData,
    setManualData,
    setSelectedManualDocumentIndex,
    selected_manual_document_index,
}) => {
    const verification_status = populateVerificationStatus(account_status);
    const { idv, has_attempted_idv, identity_last_attempt, is_idv_disallowed, manual, needs_poa, onfido } =
        verification_status;

    const poi_resubmission_cases = ['rejected', 'suspected', 'expired'];

    const has_idv_error =
        identity_last_attempt?.service && service_code.idv && poi_resubmission_cases.includes(idv.status);

    return (
        <POISubmissionForPaymentAgent
            has_attempted_idv={has_attempted_idv}
            has_idv_error={has_idv_error}
            height={height ?? null}
            identity_last_attempt={identity_last_attempt}
            idv={idv}
            idv_data={idv_data}
            is_from_external={!!is_from_external}
            is_idv_disallowed={is_idv_disallowed}
            manual={manual}
            manual_data={manual_data}
            needs_poa={needs_poa}
            onfido={onfido}
            onStateChange={() => {}}
            refreshNotifications={refreshNotifications}
            selected_country={selected_country}
            setIDVData={setIDVData}
            setManualData={setManualData}
            setSelectedManualDocumentIndex={setSelectedManualDocumentIndex}
            selected_manual_document_index={selected_manual_document_index}
        />
    );
};

export default ProofOfIdentityContainerForPaymentAgent;
