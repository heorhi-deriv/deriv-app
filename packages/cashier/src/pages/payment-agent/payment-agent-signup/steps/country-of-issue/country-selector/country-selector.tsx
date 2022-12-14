import React from 'react';
import { ResidenceList } from '@deriv/api-types';
import { Formik, Field, FieldProps } from 'formik';
import { Autocomplete, DesktopWrapper, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore } from '../../../../../../hooks';
import { TReactChangeEvent } from 'Types';
import { observer } from 'mobx-react';

type TCountrySelectorProps = {
    onfido_status: string;
    onSelect: (value?: ResidenceList[number]) => void;
    selected_country?: ResidenceList[number];
    className: string;
};

type TValues = {
    country_input: string;
};

const CountrySelector = ({ onfido_status, onSelect, className, selected_country }: TCountrySelectorProps) => {
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

    const onSubmitCountry = (values: TValues) => {
        const matching_country = residence_list?.find(c => c.text === values.country_input);
        onSelect(matching_country || {});
    };

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={onSubmitCountry}>
            {({ errors, handleBlur, handleChange, setFieldValue, touched, values }) => (
                <div className={className}>
                    <fieldset>
                        <Field name='country_input'>
                            {({ field }: FieldProps<string>) => (
                                <React.Fragment>
                                    <DesktopWrapper>
                                        <Autocomplete
                                            {...field}
                                            name='country_input'
                                            placeholder={onfido_status === 'pending' && localize('Country')}
                                            className='is-desktop'
                                            disabled={onfido_status === 'pending'}
                                            error={touched.country_input && errors.country_input}
                                            autoComplete='off'
                                            type='text'
                                            label={onfido_status !== 'pending' && localize('Country')}
                                            list_items={residence_list}
                                            value={values.country_input}
                                            onBlur={(e: TReactChangeEvent) => {
                                                handleBlur(e);
                                                const current_input = e.target.value;
                                                if (!residence_list?.find(c => c.text === current_input)) {
                                                    onSubmitCountry({ country_input: '' });
                                                }
                                            }}
                                            onChange={handleChange}
                                            onItemSelection={({ text }: { text: string }) => {
                                                const select_value = text === 'No results found' || !text ? '' : text;
                                                setFieldValue('country_input', select_value, true);
                                                onSubmitCountry({ country_input: select_value });
                                            }}
                                            required
                                        />
                                    </DesktopWrapper>
                                    <MobileWrapper>
                                        <SelectNative
                                            {...field}
                                            name='country_input'
                                            className='is-mobile'
                                            disabled={onfido_status === 'pending'}
                                            error={touched.country_input && errors.country_input}
                                            label={localize('Country')}
                                            placeholder={localize('Please select')}
                                            list_items={residence_list}
                                            value={values.country_input}
                                            onChange={(e: TReactChangeEvent) => {
                                                handleChange(e);
                                                onSubmitCountry({ country_input: e.target.value });
                                            }}
                                            use_text={true}
                                            required
                                        />
                                    </MobileWrapper>
                                </React.Fragment>
                            )}
                        </Field>
                    </fieldset>
                    {onfido_status === 'pending' && (
                        <Text
                            as='p'
                            size='xs'
                            color='less-prominent'
                            line-height='m'
                            className='pa-signup-wizard__step-selector-hint'
                        >
                            <Localize i18n_default_text='Note: As proof of identity has been submitted, you’ll not be able to edit the country of issue.' />
                        </Text>
                    )}
                </div>
            )}
        </Formik>
    );
};

export default observer(CountrySelector);
