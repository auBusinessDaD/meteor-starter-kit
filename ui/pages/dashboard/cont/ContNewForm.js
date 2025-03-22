import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useQuery, useMutation } from '@apollo/react-hooks';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Box, IconButton, Autocomplete } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import { Controller } from 'react-hook-form';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// queries
import { continuum as continuumQuery } from '../../../_queries/Continuum.gql';
import { ratings as ratingsQuery } from '../../../_queries/Ratings.gql';
import { units as unitsQuery } from '../../../_queries/Units.gql';
import { findUserByRole as usersQuery } from '../../../_queries/Users.gql';

// mutations
import {
  addCont as addContMutation,
  updateCont as updateContMutation
} from '../../../_mutations/Continuum.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

ContNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCont: PropTypes.object
};

export default function ContNewEditForm({ isEdit, currentCont }) {
  const [addCont] = useMutation(addContMutation);
  const [updateCont] = useMutation(updateContMutation);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: ratingsData, loading: ratingsLoading } = useQuery(ratingsQuery);
  const { data: unitsData, loading: unitsLoading } = useQuery(unitsQuery);
  const { data: studentData, loading: studentLoading } = useQuery(usersQuery, {
    variables: { role: "student" },
  });
  
  const NewContSchema = Yup.object().shape({
    Entry: Yup.string().required('Entry is required')
  });

  const defaultValues = useMemo(() => {
    const selectedRating =
      ratingsData?.ratings?.find((rating) => rating.Rating === currentCont?.Rating) || null;

    const selectedUnit =
      unitsData?.units?.find((unit) => unit.Unit === currentCont?.Unit) || null;

    const mappedStudent =
      studentData?.findUserByRole?.users?.find((user) => user._id === currentCont?.Student?._id) || null;

    return {
      Entry: currentCont?.Entry || '',
      Description: currentCont?.Description || '',
      Rating: selectedRating?.Rating || '',
      Unit: selectedUnit?.Unit || '',
      Student: mappedStudent
    };
  }, [currentCont, ratingsData, unitsData, studentData]);

  const methods = useForm({
    resolver: yupResolver(NewContSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentCont) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentCont]);

  const onSubmit = async (values) => {
    try {
      const { Entry, Description, Rating, Unit, Student } = values;

      console.log('Student data:', Student);

      const mutation = isEdit ? updateCont : addCont;
      const contToAddOrUpdate = {
        Entry,
        Description,
        Rating,
        Unit,
        Student: {
          _id: Student?._id || '',
          given: Student?.name?.first || '',
          family: Student?.name?.last || ''
        }
      };

      if (isEdit) {
        contToAddOrUpdate._id = currentCont._id;
      };

      mutation({
        variables: {
          ...contToAddOrUpdate
        },
        refetchQueries: [{ query: continuumQuery }]
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
        navigate(PATH_DASHBOARD.cont.root);
      });
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Controller
                name="Student"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={studentData?.findUserByRole.users || []}
                    getOptionLabel={(user) => `${user.name.first} ${user.name.last}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    loading={studentLoading}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => <RHFTextField {...params} name="Student" label="Student" />}
                  />
                )}
              />
              <RHFTextField name="Entry" label="Entry" />
              <RHFTextField name="Description" label="Description" />
              <LabelStyle>Unit</LabelStyle>
              <Controller
                name="Unit"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={unitsData?.units || []}
                    getOptionLabel={(option) => (option?.Unit ? option.Unit : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={unitsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?.Unit || '')}
                    value={unitsData?.units?.find((unit) => unit.Unit === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="Unit" label="Unit" />
                    )}
                  />
                )}
              />
              <LabelStyle>Rating</LabelStyle>
              <Controller
                name="Rating"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={ratingsData?.ratings || []}
                    getOptionLabel={(option) => (option?.Rating ? option.Rating : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={ratingsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?.Rating || '')}
                    value={ratingsData?.ratings?.find((rating) => rating.Rating === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="Rating" label="Rating" />
                    )}
                  />
                )}
              />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Entry' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
