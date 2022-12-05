import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Loading, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { UploadComplete } from '../upload-complete/upload-complete';
import PoiUnsupportedFailed from 'Components/poi-unsupported-failed';
import uploadFile from 'Components/file-uploader-container/upload-file';
import OnfidoInstruction from 'Components/poi/onfido-instruction';
import OnfidoUpload from '../../../../Sections/Verification/ProofOfIdentity/onfido-sdk-view';

import CardDetails from './card-details';
import { SELFIE_DOCUMENT } from './constants';

const STATUS = {
    IS_UPLOADING: 'IS_UPLOADING',
    IS_COMPLETED: 'IS_COMPLETED',
    IS_FAILED: 'IS_FAILED',
};

const DetailComponent = ({
    country_code_key,
    document,
    documents_supported,
    handleComplete,
    handlePOIforMT5Complete,
    height,
    is_from_external,
    is_mt5,
    is_onfido_loading,
    is_onfido_supported,
    is_pa_signup,
    onClickBack,
    onfido_service_token,
    root_class,
    selected_document_index,
    setIsCfdPoiCompleted,
    setManualData,
    setIsOnfidoLoading,
    ...props
}) => {
    const [status, setStatus] = React.useState();
    const [response_error, setError] = React.useState();

    let is_any_failed = false;

    const uploadFiles = data =>
        new Promise((resolve, reject) => {
            const docs = document.details.documents.map(item => item.name);
            const files = Object.values(data).filter(item => [...docs, SELFIE_DOCUMENT.name].includes(item.name));
            const files_length = files.length;
            let file_to_upload_index = 0;
            const results = [];
            const uploadNext = () => {
                const item = files[file_to_upload_index];
                const { file, document_type, pageType, lifetime_valid } = item;
                const expiration_date =
                    typeof data.expiry_date?.format === 'function' ? data.expiry_date.format('YYYY-MM-DD') : undefined;
                uploadFile(file, WS.getSocket, {
                    documentType: document_type,
                    pageType,
                    expirationDate: expiration_date,
                    documentId: data.document_id || '',
                    lifetimeValid: +(lifetime_valid && !expiration_date),
                })
                    .then(response => {
                        file_to_upload_index += 1;
                        if (response.warning || response.error) {
                            is_any_failed = true;
                            setStatus(STATUS.IS_FAILED);
                            setError(
                                response.message || (response.error ? response.error.message : localize('Failed'))
                            );
                            if (file_to_upload_index < files_length) {
                                uploadNext();
                            }
                        } else if (file_to_upload_index < files_length) {
                            results.push(response);
                            uploadNext();
                        } else {
                            resolve(results);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            };

            uploadNext();
        });

    const onComplete = values => {
        setStatus(STATUS.IS_UPLOADING);
        uploadFiles(values).then(() => {
            if (!is_any_failed) {
                if (is_mt5) {
                    handlePOIforMT5Complete();
                } else {
                    setStatus(STATUS.IS_COMPLETED);
                }
            }
        });
    };

    switch (status) {
        case STATUS.IS_UPLOADING:
            return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
        case STATUS.IS_COMPLETED:
            return <UploadComplete is_from_external={true} needs_poa={false} />;
        case STATUS.IS_FAILED:
            return <PoiUnsupportedFailed error={response_error} />;
        default:
            return (
                <React.Fragment>
                    {is_onfido_supported ? (
                        <React.Fragment>
                            {is_pa_signup ? (
                                <OnfidoInstruction
                                    selected_document_index={selected_document_index}
                                    setIsOnfidoLoading={setIsOnfidoLoading}
                                />
                            ) : (
                                <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                                    <Icon icon='IcArrowLeftBold' />
                                    <Text
                                        as='p'
                                        size='xs'
                                        weight='bold'
                                        color='prominent'
                                        className={`${root_class}__back-title`}
                                    >
                                        {localize('Back')}
                                    </Text>
                                </div>
                            )}
                            {is_onfido_loading && <Loading is_fullscreen={false} />}
                            <div
                                className={classNames({
                                    'payment-agent-poi__onfido-container--hidden': is_onfido_loading,
                                })}
                            >
                                <OnfidoUpload
                                    country_code={country_code_key}
                                    documents_supported={[document.onfido_name]}
                                    handleComplete={is_mt5 ? handlePOIforMT5Complete : handleComplete}
                                    height='auto'
                                    is_from_external={is_from_external}
                                    {...props}
                                />
                            </div>
                        </React.Fragment>
                    ) : (
                        <CardDetails
                            data={document.details}
                            goToCards={onClickBack}
                            is_from_external={is_from_external}
                            is_pa_signup={is_pa_signup}
                            onComplete={onComplete}
                            selected_document_index={selected_document_index}
                            setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                            setManualData={setManualData}
                        />
                    )}
                </React.Fragment>
            );
    }
};

DetailComponent.propTypes = {
    country_code_key: PropTypes.number,
    handleComplete: PropTypes.func,
    handlePOIforMT5Complete: PropTypes.func,
    has_poa: PropTypes.bool,
    height: PropTypes.number,
    is_from_external: PropTypes.bool,
    is_mt5: PropTypes.bool,
    is_onfido_loading: PropTypes.bool,
    is_pa_signup: PropTypes.bool,
    onClickBack: PropTypes.func,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    root_class: PropTypes.string,
    selected_document_index: PropTypes.string,
    setManualData: PropTypes.func,
    setIsOnfidoLoading: PropTypes.func,
};

export default DetailComponent;
