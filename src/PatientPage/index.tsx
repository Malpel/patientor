import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { Icon } from "semantic-ui-react";


const PatientPage = () => {
  const [{ fetched }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  if (fetched?.id !== id) {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
  
        dispatch({ type: "GET_PATIENT_INFO", payload: patient });
        console.log(patient);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient(id);
  }
  
  // needed because I've chosen poorly
  if (!fetched) return (<div><h1>test123</h1></div>);

  return (
    <div>
      <h3>{fetched.name} <Icon name="neuter"></Icon></h3>
      <p>SSN: {fetched.ssn}</p>
      <p>Occupation: {fetched.occupation}</p>
    </div>
  );
};

export default PatientPage;