import React from 'react';
import { Diagnosis, Entry } from '../types';
import HealthCheckEntry from './HealthCheckEntry';
import HospitalEntry from './HospitalEntry';
import OccupationalHealthcareEntry from './OccupationalHealthcareEntry';


const PatientEntry: React.FC<{ entry: Entry, diagnoses: { [code: string]: Diagnosis } }>
  = ({ entry, diagnoses }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntry entry={entry} diagnoses={diagnoses}
          discharge={entry.discharge} />;

      case "HealthCheck":
        return <HealthCheckEntry entry={entry} diagnoses={diagnoses}
          healthCheckRating={entry.healthCheckRating} />;

      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses}
          employer={entry.employerName} sickLeave={entry.sickLeave} />;

      default:
        return <h1>Default Entry</h1>;
    }

  };

export default PatientEntry;