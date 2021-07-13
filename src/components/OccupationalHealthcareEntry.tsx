import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Entry, Diagnosis } from '../types';

const OccupationalHealthcareEntry: React.FC<{
  entry: Entry, diagnoses: { [code: string]: Diagnosis },
  employer: string, sickLeave: { startDate: string, endDate: string } | undefined
}>
  = ({ entry, diagnoses, employer, sickLeave }) => {

    return (
      <Segment key={entry.id}>
        <h4>{entry.date} <Icon name="medkit"/></h4> <p>{entry.description}</p>
        Employer: {employer}
        {sickLeave ? <p>Sick Leave:  {sickLeave?.startDate} - {sickLeave?.endDate}</p> : <p></p>}
        <ul>
          {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code) =>
              <li key={code}>{code} {diagnoses[code] ? diagnoses[code].name : ""}</li>)
            : <p></p>}
        </ul>
      </Segment>
    );
  };

export default OccupationalHealthcareEntry;

