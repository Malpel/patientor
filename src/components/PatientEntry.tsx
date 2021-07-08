import React from 'react';
import { Entry } from '../types';

const PatientEntry: React.FC<{ entry: Entry, diagnosisName: string }> = ({ entry, diagnosisName }) => {
  switch (entry.type) {
    case "Hospital":
      return <h1>Hospital Entry</h1>

    default:
      return <h1>Default Entry</h1>
  }

};

export default PatientEntry;