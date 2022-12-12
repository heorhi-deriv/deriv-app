/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import classNames from 'classnames';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import OnfidoUpload from './onfido-sdk-view.jsx';
import OnfidoInstruction from 'Components/poi/onfido-instruction';
import Submitted from 'Components/poa/status/submitted';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';
import { UnsupportedForPA } from '../../../Components/poi/status/unsupported/unsupported-for-pa.jsx';
import { IdvDocSubmitOnSignup } from '../../../Components/poi/poi-form-on-signup/idv-doc-submit-on-signup/idv-doc-submit-on-signup.jsx';

const POISubmissionForPaymentAgent = ({
    has_idv_error,
    idv,
    idv_data,
    is_from_external,
    is_idv_disallowed,
    manual_data,
    onfido,
    onStateChange,
    refreshNotifications,
    selected_country,
    setIDVData,
    setManualData,
    setSelectedManualDocumentIndex,
    selected_manual_document_index,
}) => {
    const [is_onfido_loading, setIsOnfidoLoading] = React.useState(true);
    const [submission_status, setSubmissionStatus] = React.useState(); // submitting
    const [submission_service, setSubmissionService] = React.useState();

    React.useEffect(() => {
        if (selected_country) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_onfido_supported = selected_country?.identity?.services?.onfido?.is_country_supported;
            const is_idv_supported = selected_country?.identity?.services?.idv?.is_country_supported;
            if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
            } else {
                setSubmissionService(service_code.manual);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    }, [selected_country]);

    const handlePOIComplete = () => {
        if (onStateChange && typeof onStateChange === 'function') {
            onStateChange(identity_status_codes.pending);
        }
        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };

    //TODO: change onfido.status === identity_status_codes.pending and remove identity_status_codes.verified
    if ([identity_status_codes.pending, identity_status_codes.verified].includes(onfido.status)) {
        return <Submitted is_pa_signup />;
    }

    if (submission_status === submission_status_code.submitting) {
        switch (submission_service) {
            case service_code.idv:
                return (
                    <IdvDocSubmitOnSignup
                        citizen_data={selected_country}
                        has_idv_error={has_idv_error}
                        is_pa_signup
                        setIDVData={setIDVData}
                        value={idv_data.values}
                    />
                );
            case service_code.onfido: {
                const country_code = selected_country.value;
                const doc_obj = selected_country?.identity?.services?.onfido?.documents_supported;
                const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);
                return (
                    <>
                        {is_onfido_loading && <Loading is_fullscreen={false} />}
                        <div
                            className={classNames({
                                'onfido-pa-container--hidden': is_onfido_loading,
                            })}
                        >
                            <OnfidoInstruction setIsOnfidoLoading={setIsOnfidoLoading} />
                            <OnfidoUpload
                                country_code={country_code}
                                documents_supported={documents_supported}
                                handleViewComplete={handlePOIComplete}
                                height='auto'
                                is_from_external={is_from_external}
                                refreshNotifications={refreshNotifications}
                                setIsOnfidoLoading={setIsOnfidoLoading}
                            />
                        </div>
                    </>
                );
            }
            case service_code.manual:
                return (
                    <UnsupportedForPA
                        country_code={selected_country.value}
                        handlePOIforMT5Complete={handlePOIComplete}
                        is_onfido_loading={is_onfido_loading}
                        is_pa_signup
                        is_from_external={is_from_external}
                        manual_values={manual_data.values}
                        setIsOnfidoLoading={setIsOnfidoLoading}
                        setManualData={setManualData}
                        setSelectedManualDocumentIndex={setSelectedManualDocumentIndex}
                        selected_manual_document_index={selected_manual_document_index}
                    />
                );
            default:
                return null;
        }
    } else {
        return null;
    }
};

export default POISubmissionForPaymentAgent;
