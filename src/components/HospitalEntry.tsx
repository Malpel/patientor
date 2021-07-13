import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Entry, Diagnosis } from '../types';

const HospitalEntry: React.FC<{
  entry: Entry, diagnoses: { [code: string]: Diagnosis },
  discharge: { date: string, criteria: string }
}>
  = ({ entry, diagnoses, discharge }) => {

    return (
      <Segment key={entry.id}>
        <div>
          <h4>{entry.date} <Icon name="hospital outline" /></h4>
        </div>
        <br/>
        <p>{entry.description}</p>

        <p>Discharge: {discharge.date} {discharge.criteria}</p>
        <ul>
          {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code) =>
              <li key={code}>{code} {diagnoses[code] ? diagnoses[code].name : ""}</li>)
            : <p></p>}
        </ul>
      </Segment>
    );
  };
export default HospitalEntry;

