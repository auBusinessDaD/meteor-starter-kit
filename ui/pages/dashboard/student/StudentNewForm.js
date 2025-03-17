import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Box, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import {
  addStudent as addStudentMutation,
  updateStudent as updateStudentMutation
} from '../../../_mutations/Students.gql';
import { students as studentsQuery } from '../../../_queries/Students.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

StudentNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentStudent: PropTypes.object
};

export default function StudentNewEditForm({ isEdit, currentStudent }) {
  const [addStudent] = useMutation(addStudentMutation);
  const [updateStudent] = useMutation(updateStudentMutation);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewStudentSchema = Yup.object().shape({
    code: Yup.string().required('Student Code is required'),
    givenName: Yup.string().required('Given Name is required'),
    familyName: Yup.mixed().required('Family Name is required')
  });

  const defaultValues = useMemo(
    () => ({
      code: currentStudent?.code || '',
      givenName: currentStudent?.givenName || '',
      familyName: currentStudent?.familyName || ''
    }),
    [currentStudent]
  );

  const methods = useForm({
    resolver: yupResolver(NewStudentSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentStudent) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentStudent]);

  const onSubmit = async (values) => {
    try {
      const { code, givenName, familyName } = values;

      const mutation = isEdit ? updateStudent : addStudent;
      const studentToAddOrUpdate = {
        code,
        givenName,
        familyName
      };

      mutation({
        variables: {
          ...studentToAddOrUpdate
        },
        refetchQueries: [{ query: studentsQuery }]
      }).then(() => {
        reset();
        enqueueSnackbar(!isEdit ? 'Created successfully!' : 'Updated successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
        navigate(PATH_DASHBOARD.student.root);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="code" label="Student Code" />
              <RHFTextField name="givenName" label="Given Name" />
              <RHFTextField name="familyName" label="Family Name" />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Student' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
