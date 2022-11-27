import { TSelfie } from '../signup-wizard-steps/selfie-step/selfie-step';
import { ResidenceList } from '@deriv/api-types';

type TStepsState = {
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
    is_selfie_step_enabled: boolean;
    country: {
        selected_country: ResidenceList[number];
    };
};

const ACTION_TYPES = {
    SET_COUNTRY: 'SET_COUNTRY',
    SET_SELFIE: 'SET_SELFIE',
    SET_SELFIE_STEP_ENABLED: 'SET_SELFIE_STEP_ENABLED',
} as const;

// Action creators
export const setCountry = (value: { selected_country: ResidenceList[number] }) => {
    return {
        type: ACTION_TYPES.SET_COUNTRY,
        value,
    };
};

export const setSelfie = (value: { selfie_with_id: TSelfie }) => {
    return {
        type: ACTION_TYPES.SET_SELFIE,
        value,
    };
};

export const setSelfieStepEnabled = (value: boolean) => {
    return {
        type: ACTION_TYPES.SET_SELFIE_STEP_ENABLED,
        value,
    };
};

// Initial state
export const initial_state = { selfie: null, is_selfie_step_enabled: false, country: { selected_country: {} } };

// Reducer
export const stepReducer = (state: TStepsState, action: TActionsTypes): TStepsState => {
    switch (action.type) {
        case ACTION_TYPES.SET_COUNTRY:
            return { ...state, country: action.value };
        case ACTION_TYPES.SET_SELFIE:
            return { ...state, selfie: action.value };
        case ACTION_TYPES.SET_SELFIE_STEP_ENABLED:
            return { ...state, is_selfie_step_enabled: action.value };
        default:
            return state;
    }
};

export type TActionsTypes = ReturnType<typeof setSelfie | typeof setSelfieStepEnabled | typeof setCountry>;
