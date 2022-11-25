import { useCallback, useReducer } from 'react';

import { TSelfie } from '../signup-wizard-steps/selfie-step/selfie-step';

type TStepsState = {
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
    is_selfie_step_enabled: boolean;
};

const ACTION_TYPES = {
    SET_SELFIE: 'SET_SELFIE',
    SET_SELFIE_STEP_ENABLED: 'SET_SELFIE_STEP_ENABLED',
} as const;

// Action creators
const setSelfieAC = (value: { selfie_with_id: TSelfie }) => {
    return {
        type: ACTION_TYPES.SET_SELFIE,
        value,
    };
};

const setSelfieStepEnabledAC = (value: boolean) => {
    return {
        type: ACTION_TYPES.SET_SELFIE_STEP_ENABLED,
        value,
    };
};

// Initial state
const initial_state = { selfie: null, is_selfie_step_enabled: false };

// Reducer
const stepReducer = (state: TStepsState, action: TActionsTypes): TStepsState => {
    switch (action.type) {
        case ACTION_TYPES.SET_SELFIE:
            return { ...state, selfie: action.value };
        case ACTION_TYPES.SET_SELFIE_STEP_ENABLED:
            return { ...state, is_selfie_step_enabled: action.value };
        default:
            return state;
    }
};

export const usePaymentAgentSignupReducer = () => {
    const [steps_state, dispatch] = useReducer(stepReducer, initial_state);

    const setSelfie = useCallback((value: { selfie_with_id: TSelfie }) => dispatch(setSelfieAC(value)), []);
    const setSelfieStepEnabled = useCallback((value: boolean) => dispatch(setSelfieStepEnabledAC(value)), []);

    return { steps_state, setSelfie, setSelfieStepEnabled };
};

type TActionsTypes = ReturnType<typeof setSelfieAC | typeof setSelfieStepEnabledAC>;
