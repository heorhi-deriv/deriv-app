import { useCallback, useReducer } from 'react';
import { ResidenceList } from '@deriv/api-types';
import { TSelfie } from './selfie/selfie';

type TStepsState = {
    selfie: {
        selfie_with_id: TSelfie;
    } | null;
    selected_country?: ResidenceList[number];
};

const ACTION_TYPES = {
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

// Initial state
const initial_state = { selected_country: {}, selfie: null };

// Reducer
const stepsReducer = (state: TStepsState, action: TActionsTypes): TStepsState => {
    switch (action.type) {
        case ACTION_TYPES.SET_SELFIE:
            return { ...state, selfie: { selfie_with_id: action.value } };
        case ACTION_TYPES.SET_SELECTED_COUNTRY:
            return { ...state, selected_country: action.value };
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

    return { steps_state, setSelectedCountry, setSelfie };
};

type TActionsTypes = ReturnType<typeof setSelfieAC | typeof setSelectedCountryAC>;
