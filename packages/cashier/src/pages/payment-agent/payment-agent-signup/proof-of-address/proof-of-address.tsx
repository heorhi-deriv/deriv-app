import React from 'react';
import { Autocomplete, Input, DesktopWrapper, MobileWrapper, SelectNative, useStateCallback } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { WS, validAddress, validPostCode, validLetterSymbol, validLength } from '@deriv/shared';
import { useStore } from '../../../../hooks';
import { FileUploaderContainer } from '@deriv/account';

type TFormValues = {
    address_line_1: string;
    address_line_2: string;
    address_city: string;
    address_state: string;
    address_postcode: string | number;
};

type TProofOfAddressProps = {
    account_settings: any;
    fetchResidenceList: any;
    fetchStatesList: any;
    is_eu: boolean;
};

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

let file_uploader_ref = null;

const ProofOfAddress = ({ account_settings, fetchStatesList, is_eu }: TProofOfAddressProps) => {
    const [form_values, setFormValues] = useStateCallback({});
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [is_loading, setIsLoading] = React.useState(true);
    const { client } = useStore();
    const { states_list, fetchResidenceList } = client;

    React.useEffect(() => {
        fetchResidenceList().then(() => {
            Promise.all([fetchStatesList(), WS.wait('get_settings')]).then(() => {
                const { citizen, tax_identification_number, tax_residence } = account_settings;
                setFormValues(
                    {
                        ...account_settings,
                        ...(is_eu ? { citizen, tax_identification_number, tax_residence } : {}),
                    },
                    () => setIsLoading(false)
                );
            });
        });
    }, [account_settings, fetchResidenceList, fetchStatesList, is_eu, setFormValues]);

    const { address_line_1, address_line_2, address_city, address_state, address_postcode } = form_values;

    const form_initial_values = {
        address_line_1,
        address_line_2,
        address_city,
        address_state,
        address_postcode,
    };

    const validateFields = (values: TFormValues) => {
        setFormState({ ...form_state, ...{ should_allow_submit: false } });
        const errors: Partial<TFormValues> = {};
        const validateValues = validate(errors, values);

        const required_fields = ['address_line_1', 'address_city'];
        validateValues(val => val, required_fields, localize('This field is required'));

        const permitted_characters = ". , ' : ; ( ) @ # / -";
        const address_validation_message = localize(
            'Use only the following special characters: {{ permitted_characters }}',
            {
                permitted_characters,
                interpolation: { escapeValue: false },
            }
        );

        if (values.address_line_1 && !validAddress(values.address_line_1)) {
            errors.address_line_1 = address_validation_message;
        }
        if (values.address_line_2 && !validAddress(values.address_line_2)) {
            errors.address_line_2 = address_validation_message;
        }

        const validation_letter_symbol_message = localize(
            'Only letters, space, hyphen, period, and apostrophe are allowed.'
        );

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = validation_letter_symbol_message;
        }

        // only add state/province validation for countries that don't have states list fetched from API
        if (values.address_state && !validLetterSymbol(values.address_state) && states_list?.length < 1) {
            errors.address_state = validation_letter_symbol_message;
        }

        if (values.address_postcode) {
            if (!validLength(values.address_postcode, { min: 0, max: 20 })) {
                errors.address_postcode = localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('Postal/ZIP code'),
                    max_number: 20,
                    interpolation: { escapeValue: false },
                });
            } else if (!validPostCode(values.address_postcode)) {
                errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
            }
        }

        return errors;
    };

    const onSubmitValues = (values: TFormValues) => {
        // console.log('🚀 ~ file: proof-of-address.tsx ~ line 22 ~ values', values);
    };

    return (
        <Formik initialValues={form_initial_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                <form noValidate className='account-form' onSubmit={handleSubmit}>
                    <div className='account-poa__details-fields'>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                maxLength={70}
                                name='address_line_1'
                                label={localize('First line of address')}
                                value={values.address_line_1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.address_line_1 && errors.address_line_1}
                                required
                            />
                        </fieldset>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                maxLength={70}
                                name='address_line_2'
                                label={localize('Second line of address (optional)')}
                                value={values.address_line_2}
                                error={touched.address_line_2 && errors.address_line_2}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </fieldset>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                name='address_city'
                                label={localize('Town/City')}
                                value={values.address_city}
                                error={touched.address_city && errors.address_city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                        </fieldset>
                        <fieldset className='account-form__fieldset'>
                            {states_list.length ? (
                                <React.Fragment>
                                    <DesktopWrapper>
                                        <Field name='address_state'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    label={localize('State/Province')}
                                                    error={touched.address_state && errors.address_state}
                                                    list_items={states_list}
                                                    onItemSelection={({ value, text }) =>
                                                        setFieldValue('address_state', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </DesktopWrapper>
                                    <MobileWrapper>
                                        <SelectNative
                                            placeholder={localize('Please select')}
                                            label={localize('State/Province')}
                                            value={values.address_state}
                                            list_items={states_list}
                                            error={touched.address_state && errors.address_state}
                                            use_text={true}
                                            onChange={e => setFieldValue('address_state', e.target.value, true)}
                                        />
                                    </MobileWrapper>
                                </React.Fragment>
                            ) : (
                                <Input
                                    data-lpignore='true'
                                    autoComplete='off' // prevent chrome autocomplete
                                    type='text'
                                    name='address_state'
                                    label={localize('State/Province')}
                                    value={values.address_state}
                                    error={touched.address_state && errors.address_state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            )}
                        </fieldset>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                name='address_postcode'
                                label={localize('Postal/ZIP code')}
                                value={values.address_postcode}
                                error={touched.address_postcode && errors.address_postcode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </fieldset>
                    </div>

                    <FileUploaderContainer
                        onRef={ref => (file_uploader_ref = ref)}
                        onFileDrop={df => setDocumentFile({ files: df.files, error_message: df.error_message })}
                        getSocket={WS.getSocket}
                    />
                </form>
            )}
        </Formik>
    );
};

export default ProofOfAddress;
