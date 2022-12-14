import { useCallback, useReducer } from 'react';
import { isEmptyObject } from '@deriv/shared';
import { ResidenceList } from '@deriv/api-types';
import { TSelfie } from './selfie/selfie';
import { Moment } from 'moment';

//TODO: refactor TSelfie type into TUploadedDocumentType

type TManualPassportValues = {
    document_id: string;
    expiry_date: Moment | string;
    passport: TSelfie | string | null;
};

type TManualDrivingLicense = {
    document_id: string;
    driving_licence_back: TSelfie | string | null;
    driving_licence_front: TSelfie | string | null;
    expiry_date: Moment | string;
};

//TODO: add NIMC type

type TManualIdentityCard = {
    document_id: string;
    identity_card_back: TSelfie | string | null;
    identity_card_front: TSelfie | string | null;
    expiry_date: Moment | string;
};

type TManualValues = Partial<TManualPassportValues | TManualDrivingLicense | TManualIdentityCard>;

type TManualErrors = Partial<
    | Record<keyof TManualPassportValues, string>
    | Record<keyof TManualDrivingLicense, string>
    | Record<keyof TManualIdentityCard, string>
>;

export type TStepsState = {
    idv_data: {
        values: {
            document_number: string;
            document_type: {
                example_format: string;
                id: string;
                sample_image: string;
                text: string;
                value: string;
            };
        };
        errors: { document_number?: string; document_type?: string };
        country_code?: string;
    };
    manual_data: {
        values: TManualValues;
        errors: TManualErrors;
    };
    selected_manual_document_index: string;
    is_identity_submission_disabled: boolean;
    selected_country?: ResidenceList[number];
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
};

// Action creators
const setSelfieAC = (value: TSelfie) => {
    return {
        type: 'SET_SELFIE',
        value,
    } as const;
};

const setSelectedCountryAC = (value?: ResidenceList[number]) => {
    return {
        type: 'SET_SELECTED_COUNTRY',
        value,
    } as const;
};

const setIDVDataAC = (value: TStepsState['idv_data']) => {
    return {
        type: 'SET_IDV_DATA',
        value,
    } as const;
};

const setIsIdentitySubmissionDisabledAC = (value: boolean) => {
    return {
        type: 'SET_IS_IDENTITY_SUBMISSION_DISABLED',
        value,
    } as const;
};

const setManualDataAC = (value: TStepsState['manual_data']) => {
    return {
        type: 'SET_MANUAL_DATA',
        value,
    } as const;
};

const setSelectedManualDocumentIndexAC = (value: string) => {
    return {
        type: 'SET_SELECTED_MANUAL_DOCUMENT_INDEX',
        value,
    } as const;
};

// Initial state
const initial_state = {
    idv_data: {
        values: {
            document_number: '',
            document_type: { example_format: '', id: '', sample_image: '', text: '', value: '' },
        },
        errors: { document_number: '', document_type: '' },
        country_code: '',
    },
    is_identity_submission_disabled: true,
    manual_data: { values: {}, errors: {} },
    selected_country: {},
    selected_manual_document_index: '',
    selfie: null,
};

// Reducer
const stepsReducer = (state: TStepsState, action: TActionsTypes): TStepsState => {
    switch (action.type) {
        case 'SET_SELFIE':
            return { ...state, selfie: { selfie_with_id: action.value } };
        case 'SET_SELECTED_COUNTRY':
            return { ...state, selected_country: action.value };
        case 'SET_IS_IDENTITY_SUBMISSION_DISABLED':
            return { ...state, is_identity_submission_disabled: action.value };
        case 'SET_IDV_DATA': {
            return {
                ...state,
                idv_data: {
                    values: action.value.values,
                    errors: action.value.errors,
                    country_code: action.value.country_code,
                },
                is_identity_submission_disabled:
                    !isEmptyObject(action.value.errors) || !action.value.values.document_type.id,
            };
        }
        case 'SET_MANUAL_DATA': {
            return {
                ...state,
                manual_data: { values: action.value.values, errors: action.value.errors },
                is_identity_submission_disabled:
                    !isEmptyObject(action.value.errors) || isEmptyObject(action.value.values),
            };
        }
        case 'SET_SELECTED_MANUAL_DOCUMENT_INDEX':
            return { ...state, selected_manual_document_index: action.value };
        default:
            return state;
    }
};

export const usePaymentAgentSignupReducer = () => {
    const [steps_state, dispatch] = useReducer(stepsReducer, initial_state);

    const setSelfie = useCallback((value: TSelfie) => dispatch(setSelfieAC(value)), []);
    const setSelectedCountry = useCallback(
        (value?: ResidenceList[number]) => dispatch(setSelectedCountryAC(value)),
        []
    );
    const setSelectedManualDocumentIndex = useCallback(
        (value: string) => dispatch(setSelectedManualDocumentIndexAC(value)),
        []
    );
    const setIDVData = useCallback((value: TStepsState['idv_data']) => dispatch(setIDVDataAC(value)), []);
    const setManualData = useCallback((value: TStepsState['manual_data']) => dispatch(setManualDataAC(value)), []);
    const setIsIdentitySubmissionDisabled = useCallback(
        (value: boolean) => dispatch(setIsIdentitySubmissionDisabledAC(value)),
        []
    );

    return {
        steps_state,
        setIDVData,
        setManualData,
        setSelectedCountry,
        setSelectedManualDocumentIndex,
        setSelfie,
        setIsIdentitySubmissionDisabled,
    };
};

type TActionsTypes = ReturnType<
    | typeof setSelfieAC
    | typeof setSelectedCountryAC
    | typeof setSelectedManualDocumentIndexAC
    | typeof setIDVDataAC
    | typeof setManualDataAC
    | typeof setIsIdentitySubmissionDisabledAC
>;
