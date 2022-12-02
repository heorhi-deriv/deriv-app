import { useCallback, useReducer } from 'react';
import { ResidenceList } from '@deriv/api-types';
import { TSelfie } from './selfie/selfie';

export type TStepsState = {
    idv_values: {
        document_number: string;
        document_type: {
            example_format: string;
            id: string;
            sample_image: string;
            text: string;
            value: string;
        };
    };
    is_identity_submission_disabled: boolean;
    selected_country?: ResidenceList[number];
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
};

const ACTION_TYPES = {
    SET_IDV_VALUES: 'SET_IDV_VALUES',
    SET_IS_IDENTITY_SUBMISSION_DISABLED: 'SET_IS_IDENTITY_SUBMISSION_DISABLED',
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

const setIDVValuesAC = (value: TStepsState['idv_values']) => {
    return {
        type: ACTION_TYPES.SET_IDV_VALUES,
        value,
    };
};

const setIsIdentitySubmissionDisabledAC = (value: boolean) => {
    return {
        type: ACTION_TYPES.SET_IS_IDENTITY_SUBMISSION_DISABLED,
        value,
    };
};

// Initial state
const initial_state = {
    idv_values: {
        document_number: '',
        document_type: { example_format: '', id: '', sample_image: '', text: '', value: '' },
    },
    is_identity_submission_disabled: true,
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
        case ACTION_TYPES.SET_IDV_VALUES: {
            const is_idv_submission_disabled = !action.value.document_type.id && !action.value.document_number;
            return {
                ...state,
                idv_values: action.value,
                is_identity_submission_disabled: !!is_idv_submission_disabled,
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
    const setIDVValues = useCallback((value: TStepsState['idv_values']) => dispatch(setIDVValuesAC(value)), []);
    const setIsIdentitySubmissionDisabled = useCallback(
        (value: boolean) => dispatch(setIsIdentitySubmissionDisabledAC(value)),
        []
    );

    return {
        steps_state,
        setIDVValues,
        setSelectedCountry,
        setSelfie,
        setIsIdentitySubmissionDisabled,
    };
};

type TActionsTypes = ReturnType<
    typeof setSelfieAC | typeof setSelectedCountryAC | typeof setIDVValuesAC | typeof setIsIdentitySubmissionDisabledAC
>;
