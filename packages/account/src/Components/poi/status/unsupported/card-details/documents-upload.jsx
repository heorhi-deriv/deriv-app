import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile, isEmptyObject } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';
import InputField from './input-field.jsx';
import Uploader from './uploader.jsx';
import { setInitialValues, validateFields } from './utils';
import { ROOT_CLASS } from '../constants';

const icons = [
    {
        icon: 'IcPoiClearPhoto',
        text: localize('A clear colour photo or scanned image'),
    },
    {
        icon: 'IcPoiFileFormat',
        text: localize('JPEG, JPG, PNG, PDF, or GIF'),
    },
    {
        icon: 'IcPoiFileSize',
        text: localize('Less than 8MB'),
    },
    {
        icon: 'IcPoiDocExpiry',
        text: localize('Must be valid for at least 6 months'),
    },
];

const IconsItem = ({ data }) => (
    <div className={`${ROOT_CLASS}__icons-item`}>
        <Icon icon={data.icon} size={24} />
        <Text as='p' size='xxxs' align='center'>
            {data.text}
        </Text>
    </div>
);

const DocumentsUpload = ({
    initial_values,
    is_pa_signup,
    is_from_external,
    data,
    goToCards,
    onSubmit,
    manual_values,
    setManualData,
}) => {
    const formik_ref = React.useRef();

    const { fields, documents_title, documents } = data;

    const fields_title = localize('First, enter your {{label}} and the expiry date.', {
        label: fields[0].label,
    });

    // TODO: refactor nested ternary
    // eslint-disable-next-line no-nested-ternary
    const formik_initial_values = !is_pa_signup
        ? initial_values || setInitialValues([...fields, ...documents])
        : !isEmptyObject(manual_values)
        ? manual_values
        : setInitialValues([...fields, ...documents]);

    React.useEffect(() => {
        if (is_pa_signup && isEmptyObject(manual_values))
            formik_ref?.current.resetForm({ values: setInitialValues([...fields, ...documents]) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_pa_signup, fields, documents]);

    return (
        <div
            className={classNames(ROOT_CLASS, {
                [`${ROOT_CLASS}--mobile`]: isMobile(),
            })}
        >
            <Formik
                initialValues={formik_initial_values}
                validate={values => validateFields(values, fields, documents, setManualData)}
                onSubmit={onSubmit}
                innerRef={formik_ref}
            >
                {({ values, isValid, touched }) => {
                    const is_form_touched = Object.keys(touched).length > 0;
                    const is_form_empty = Object.values(values).some(
                        (field, key) => (field === null || field === '') && fields[key]?.required
                    );

                    return (
                        <Form className={`${ROOT_CLASS}__form`}>
                            <div className={`${ROOT_CLASS}__fields-content`}>
                                {!is_pa_signup && (
                                    <Text as='h3' size='s' color='prominent'>
                                        {fields_title}
                                    </Text>
                                )}
                                <div className={`${ROOT_CLASS}__fields-wrap`}>
                                    {fields.map(field => (
                                        <InputField key={field.name} data={field} />
                                    ))}
                                </div>
                                <div className={`${ROOT_CLASS}__divider`} />
                                <Text as='h3' size='s' color='prominent'>
                                    {documents_title}
                                </Text>
                                <div className={`${ROOT_CLASS}__uploaders-wrap`}>
                                    {documents.map(item => (
                                        <Uploader
                                            key={item.name}
                                            data={item}
                                            value={values[item.name]}
                                            is_full={documents.length === 1 || is_from_external}
                                        />
                                    ))}
                                </div>
                                <div className={`${ROOT_CLASS}__icons`}>
                                    {icons.map(item => (
                                        <IconsItem key={item.icon} data={item} />
                                    ))}
                                </div>
                            </div>
                            {!is_pa_signup && (
                                <div className={`${ROOT_CLASS}__btns`}>
                                    <Button
                                        onClick={goToCards}
                                        secondary
                                        large
                                        text={localize('Go back')}
                                        icon={<Icon icon={'IcButtonBack'} size={16} />}
                                    />
                                    <Button
                                        type='submit'
                                        primary
                                        large
                                        is_disabled={!isValid || (!is_form_touched && is_form_empty)}
                                        text={localize('Next')}
                                    />
                                </div>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

DocumentsUpload.propTypes = {
    data: PropTypes.object,
    initial_values: PropTypes.object,
    is_from_external: PropTypes.bool,
    is_pa_signup: PropTypes.bool,
    manual_values: PropTypes.object,
    goToCards: PropTypes.func,
    onSubmit: PropTypes.func,
    document_index: PropTypes.string,
    setManualData: PropTypes.func,
};
export default DocumentsUpload;
