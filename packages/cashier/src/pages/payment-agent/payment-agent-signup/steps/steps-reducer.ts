import { useCallback, useReducer } from 'react';
import { isEmptyObject } from '@deriv/shared';
import { ResidenceList } from '@deriv/api-types';
import { TSelfie } from './selfie/selfie';

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
        errors: { document_number: string; document_type: string };
    };
    manual_data: { values: any; errors: any };
    is_identity_submission_disabled: boolean;
    selected_country?: ResidenceList[number];
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
};

const ACTION_TYPES = {
    SET_IDV_DATA: 'SET_IDV_DATA',
    SET_IS_IDENTITY_SUBMISSION_DISABLED: 'SET_IS_IDENTITY_SUBMISSION_DISABLED',
    SET_MANUAL_DATA: 'SET_MANUAL_DATA',
    SET_SELFIE: 'SET_SELFIE',
    SET_SELECTED_COUNTRY: 'SET_SELECTED_COUNTRY',
} as const;

// Action creators
const setSelfieAC = (value: TSelfie) => {
    return {
        type: ACTION_TYPES.SET_SELFIE,
        value,
    };
};

const setSelectedCountryAC = (value?: ResidenceList[number]) => {
    return {
        type: ACTION_TYPES.SET_SELECTED_COUNTRY,
        value,
    };
};

const setIDVDataAC = (value: TStepsState['idv_data']) => {
    return {
        type: ACTION_TYPES.SET_IDV_DATA,
        value,
    };
};

const setIsIdentitySubmissionDisabledAC = (value: boolean) => {
    return {
        type: ACTION_TYPES.SET_IS_IDENTITY_SUBMISSION_DISABLED,
        value,
    };
};

const setManualDataAC = (value: any) => {
    return {
        type: ACTION_TYPES.SET_MANUAL_DATA,
        value,
    };
};

// Initial state
const initial_state = {
    idv_data: {
        values: {
            document_number: '',
            document_type: { example_format: '', id: '', sample_image: '', text: '', value: '' },
        },
        errors: { document_number: '', document_type: '' },
    },
    is_identity_submission_disabled: true,
    manual_data: { values: {}, errors: {} },
    selected_country: {},
    selfie: null,
};

// Reducer
const stepsReducer = (state: TStepsState, action: TActionsTypes): TStepsState => {
    switch (action.type) {
        case ACTION_TYPES.SET_SELFIE:
            return { ...state, selfie: { selfie_with_id: action.value } };
        case ACTION_TYPES.SET_SELECTED_COUNTRY:
            return { ...state, selected_country: action.value };
        case ACTION_TYPES.SET_IS_IDENTITY_SUBMISSION_DISABLED:
            return { ...state, is_identity_submission_disabled: action.value };
        case ACTION_TYPES.SET_IDV_DATA: {
            return {
                ...state,
                idv_data: { values: { ...action.value.values }, errors: { ...action.value.errors } },
                is_identity_submission_disabled: !isEmptyObject(action.value.errors),
            };
        }
        case ACTION_TYPES.SET_MANUAL_DATA: {
            return {
                ...state,
                manual_data: { values: { ...action.value.values }, errors: { ...action.value.errors } },
                is_identity_submission_disabled: !isEmptyObject(action.value.errors),
            };
        }
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
        setSelfie,
        setIsIdentitySubmissionDisabled,
    };
};

type TActionsTypes = ReturnType<
    | typeof setSelfieAC
    | typeof setSelectedCountryAC
    | typeof setIDVDataAC
    | typeof setManualDataAC
    | typeof setIsIdentitySubmissionDisabledAC
>;
