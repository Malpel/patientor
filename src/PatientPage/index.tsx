import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import { useParams } from "react-router-dom";
import { getPatientInfo, useStateValue } from "../state";
import AddEntryModal from "../AddEntryModal";
import { Button, Segment, Icon } from 'semantic-ui-react';
import { EntryWithoutId } from '../types';
import PatientEntry from "../components/PatientEntry";

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

    if (id !== patient?.id) {
      void fetchPatient(id);
    }

  }, [dispatch]);

  const submitNewEntry = async (values: EntryWithoutId) => {
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
          <Segment><h2>{patient.name}
            {patient.gender === "male" && <Icon name="man" />}
            {patient.gender === "female" && <Icon name="woman" />}
            {patient.gender === "other" && <Icon name="other gender horizontal" />}
          </h2>
            <p>
              SSN: {patient.ssn} <br />
              Occupation: {patient.occupation}
            </p>
          </Segment>
          <br />
          <div>
            <h3>Entries</h3>
            {Object.values(patient.entries).map((entry: Entry) => (
              <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
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