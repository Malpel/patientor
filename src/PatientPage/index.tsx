import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import { useParams } from "react-router-dom";
import { getPatientInfo, useStateValue } from "../state";
import AddEntryModal from "../AddEntryModal";
import { Button } from 'semantic-ui-react';
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientPage = () => {
  const [{ patient, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        dispatch(getPatientInfo(patientFromApi));
        console.log("fetched: ", patientFromApi);
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

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      console.log("New entry: ", newEntry);
      dispatch(getPatientInfo(newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

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
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
          />
          <Button onClick={() => openModal()}>Add New Entry</Button>
        </div>

        : <div>
          <h1>Loading...</h1>
        </div>}


    </div>
  );
};

export default PatientPage;