import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  | {
    type: "GET_PATIENT_INFO";
    payload: Patient;
  }
  | {
    type: "SET_DIAGNOSES";
    payload: Diagnosis[];
  };

export const setPatientList = (patientList: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patientList
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const getPatientInfo = (patient: Patient): Action => {
  return {
    type: "GET_PATIENT_INFO",
    payload: patient
  };
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSES",
    payload: diagnoses
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };

    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };

    case "GET_PATIENT_INFO":
      return {
        ...state,
        patient: action.payload
      };

    case "SET_DIAGNOSES":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        }
      };

    default:
      return state;
  }
};
