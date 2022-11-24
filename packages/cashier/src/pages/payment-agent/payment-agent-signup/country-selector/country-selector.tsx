import React from 'react';
import { ResidenceList } from '@deriv/api-types';
import { Formik, Field, FieldProps } from 'formik';
import { Autocomplete, DesktopWrapper, MobileWrapper, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore } from '../../../../hooks';
import { TReactChangeEvent } from 'Types';
import { observer } from 'mobx-react';

type TCountrySelectorProps = {
    onSelect: (country?: ResidenceList[number]) => void;
    selected_country?: ResidenceList[number];
    className: string;
};

type TValues = {
    country_input: string;
};

const CountrySelector = ({ onSelect, className, selected_country }: TCountrySelectorProps) => {
    const {
        client: { residence_list },
    } = useStore();

    const initial_form_values = {
        country_input: selected_country?.text || '',
    };

    const validateFields = (values: TValues) => {
        const errors: TValues = {
            country_input: '',
        };
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!residence_list?.find(c => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };

    const submitCountry = (values: TValues) => {
        const matching_country = residence_list?.find(c => c.text === values.country_input);
        onSelect(matching_country);
    };

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitCountry}>
            {({ errors, handleBlur, handleChange, setFieldValue, touched, values }) => (
                <div className={className}>
                    {residence_list && residence_list.length && (
                        <fieldset>
                            <Field name='country_input'>
                                {({ field }: FieldProps<string>) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                name='country_input'
                                                className='is-desktop'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={residence_list}
                                                value={values.country_input}
                                                onBlur={(e: TReactChangeEvent) => {
                                                    handleBlur(e);
                                                    const current_input = e.target.value;
                                                    if (!residence_list?.find(c => c.text === current_input)) {
                                                        submitCountry({ country_input: '' });
                                                    }
                                                }}
                                                onChange={handleChange}
                                                onItemSelection={({ text }: { text: string }) => {
                                                    const select_value =
                                                        text === 'No results found' || !text ? '' : text;
                                                    setFieldValue('country_input', select_value, true);
                                                    submitCountry({ country_input: select_value });
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                {...field}
                                                name='country_input'
                                                className='is-mobile'
                                                error={touched.country_input && errors.country_input}
                                                label={localize('Country')}
                                                placeholder={localize('Please select')}
                                                list_items={residence_list}
                                                value={values.country_input}
                                                onChange={(e: TReactChangeEvent) => {
                                                    handleChange(e);
                                                    submitCountry({ country_input: e.target.value });
                                                }}
                                                use_text={true}
                                                required
                                            />
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    )}
                </div>
            )}
        </Formik>
    );
};

export default observer(CountrySelector);
