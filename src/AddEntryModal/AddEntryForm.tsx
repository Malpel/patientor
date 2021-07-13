import React from 'react';
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, DiagnosisSelection, NumberField } from "../AddPatientModal/FormField";
import { Entry } from "../types";
import { useStateValue } from '../state';

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [visitType, setVisitType] = React.useState<"HealthCheck" | "OccupationalHealthcare" | "Hospital">();

  React.useEffect(() => {
    console.log(visitType);

  }, [visitType]);

  if (!visitType) {
    return (
      <div>
        <p onClick={() => setVisitType("HealthCheck")}>Health Check</p>
        <p onClick={() => setVisitType("OccupationalHealthcare")}>Occupational Healthcare</p>
        <p onClick={() => setVisitType("Hospital")}>Hospital</p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: visitType,
        discharge: {date: "", criteria: ""},
        healthCheckRating: 0,
        employerName: "",
        sickLeave: { startDate: "", endDate: ""}
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        
        switch (values.type) {
          case "OccupationalHealthcare":
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            break;

          case "Hospital":
            if (!values.discharge.date) {
              errors.discharge = requiredError;
            }
            break;
            
          default:
            if (!values.healthCheckRating) {
              errors.healthCheckRating = requiredError;
            }
        }

        return errors;
      }}
    >

      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">

            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />

            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />

            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

            {visitType === "HealthCheck" &&
              <Field
                label="Health check rating"
                placeholder="Health Check Rating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />}

            {visitType === "OccupationalHealthcare" &&
              <div>
                <Field
                  onChange={() => setFieldValue("type", visitType)}
                  label="Employer name"
                  placeholder="Employer"
                  component={TextField}
                  name="employerName"
                />

                <Field
                  label="Sick leave start"
                  placeholder="Sick leave start date"
                  name="sickLeave.startDate"
                  component={TextField}
                />

                <Field
                  label="Sick leave end"
                  placeholder="Sick leave end date"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </div>
            }

            {visitType === "Hospital" &&
              <div onChange={() => setFieldValue("type", visitType)}>
                <Field
                  label="Discharge date"
                  placeholder="Discharge date"
                  name="discharge.date"
                  component={TextField}
                />

                <Field
                  label="Discharge criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </div>
            }

            <DiagnosisSelection setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoses)} />

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>

              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik >
  );
};

export default AddEntryForm;