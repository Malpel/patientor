import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useParams } from "react-router-dom";
import { getPatientInfo, useStateValue } from "../state";
import { Icon } from "semantic-ui-react";


const PatientPage = () => {
  const [{ fetched }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        dispatch(getPatientInfo(patient));
        console.log("fetched: ", patient);
      } catch (e) {
        console.error(e);
      }
    };

    // despite all the effort in understanding what goes wrong
    // this is the only solution I got working
    // the problem was that useEffect() would fire on every render
    // despite no changes in the state
    if (id !== fetched?.id) {
      void fetchPatient(id);
    }

  }, [dispatch]);


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