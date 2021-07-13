import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Diagnosis, Entry } from '../types';
import HealthRatingBar from './HealthRatingBar';

const HealthCheckEntry: React.FC<{
  entry: Entry, diagnoses: { [code: string]: Diagnosis },
  healthCheckRating: number
}>
  = ({ entry, diagnoses, healthCheckRating }) => {

    return (
      <Segment key={entry.id}>
        <h4>{entry.date} <Icon name="stethoscope"/></h4> <p>{entry.description}</p>
        <HealthRatingBar rating={healthCheckRating} showText={true}/>
        <ul>
          {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code) =>
              <li key={code}>{code} {diagnoses[code] ? diagnoses[code].name : ""}</li>)
            : <p></p>}
        </ul>
      </Segment>
    );
  };

export default HealthCheckEntry;