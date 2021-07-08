import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import { useParams } from "react-router-dom";
import { getPatientInfo, useStateValue } from "../state";


const PatientPage = () => {
  const [{ patient, diagnoses }, dispatch] = useStateValue();
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
    if (id !== patient?.id) {
      void fetchPatient(id);
    }

  }, [dispatch]);

  return (
    <div>
      {patient
        ? <div>
          <h3>{patient.name}, {patient.gender}</h3>
          <p>
            SSN: {patient.ssn} <br />
            Occupation: {patient.occupation}
          </p>
          <br />
          <div>
            <h4>Entries</h4>
            {Object.values(patient.entries).map((entry: Entry) => (
              <div key={entry.id}>
                <p>{entry.date}: {entry.description}</p>
                <ul>
                  {entry.diagnosisCodes
                    ? entry.diagnosisCodes.map((code) => <li key={code}>{code} {diagnoses[code] ? diagnoses[code].name : ""}</li>)
                    : <p></p>}
                </ul>
              </div>
            ))}
          </div>
        </div>

        : <div>
          <h1>Loading...</h1>
        </div>}


    </div>
  );
};

export default PatientPage;