import React from 'react';
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, DiagnosisSelection, NumberField } from "../AddPatientModal/FormField";
import { useStateValue } from '../state';
import { EntryWithoutId } from '../types';

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const validateDate = (date: string): string | undefined => {
  let error;

  if (!date) {
    error = "Field is required";
  }

  if (!Date.parse(date)) {
    error =  "Malformed date";
  }

  return error;
};

const validateString = (field : string): string | undefined => {
  return field ? undefined : "Field is required";
};

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [visitType, setVisitType] = React.useState<"HealthCheck" | "OccupationalHealthcare" | "Hospital">();

  React.useEffect(() => {
    console.log(visitType);
  }, [visitType]);

  if (!visitType) {
    return (
      <div>
        <Button onClick={() => setVisitType("HealthCheck")} color="blue">Health Check</Button>
        <Button onClick={() => setVisitType("OccupationalHealthcare")} color="blue">Occupational Healthcare</Button>
        <Button onClick={() => setVisitType("Hospital")} color="blue">Hospital</Button>
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
        discharge: { date: "", criteria: "" },
        healthCheckRating: 0,
        employerName: "",
        sickLeave: { startDate: "", endDate: "" }
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
              validate={validateDate}
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
                  validate={validateString}
                />

                <Field
                  label="Sick leave start"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                  validate={validateDate}
                />

                <Field
                  label="Sick leave end"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                  validate={validateDate}
                />
              </div>
            }

            {visitType === "Hospital" &&
              <div onChange={() => setFieldValue("type", visitType)}>
                <Field
                  label="Discharge date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  component={TextField}
                  validate={validateDate}
                />

                <Field
                  label="Discharge criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                  validate={validateString}
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