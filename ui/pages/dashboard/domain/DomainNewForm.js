import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useQuery, useMutation } from '@apollo/react-hooks';
import { findUserByRole as teachersQuery } from '../../../_queries/Users.gql';

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

// mutations
import {
  addDomain as addDomainMutation,
  updateDomain as updateDomainMutation
} from '../../../_mutations/Domains.gql';
import { domains as domainsQuery } from '../../../_queries/Domains.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

DomainNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDomain: PropTypes.object
};

export default function DomainNewEditForm({ isEdit, currentDomain }) {
  const [addDomain] = useMutation(addDomainMutation);
  const [updateDomain] = useMutation(updateDomainMutation);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { data: teachersData, loading: teachersLoading } = useQuery(teachersQuery, {
    variables: { role: "teacher" },
  });

  const NewDomainSchema = Yup.object().shape({
    Domain: Yup.string().required('Domain is required')
  });

  const defaultValues = useMemo(() => {
    const mappedTeachers =
      currentDomain?.Teachers?.map((teacherId) =>
        teachersData?.findUserByRole?.users?.find((user) => user._id === teacherId)
      ) || [];

    return {
      Domain: currentDomain?.Domain || '',
      Description: currentDomain?.Description || '',
      Teachers: mappedTeachers,
    };
  }, [currentDomain, teachersData]);

  const methods = useForm({
    resolver: yupResolver(NewDomainSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentDomain) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentDomain]);

  const onSubmit = async (values) => {
    try {
      const { Domain, Description, Teachers } = values;

      const mutation = isEdit ? updateDomain : addDomain;
      const domainToAddOrUpdate = {
        Domain,
        Description,
        Teachers: Teachers.map((teacher) => teacher._id)
      };

      if (isEdit) {
        domainToAddOrUpdate._id = currentDomain._id;
      };

      mutation({
        variables: {
          ...domainToAddOrUpdate
        },
        refetchQueries: [{ query: domainsQuery }]
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
        navigate(PATH_DASHBOARD.domain.root);
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
              <RHFTextField name="Domain" label="Domain" />
              <RHFTextField name="Description" label="Description" />
              <LabelStyle>Teachers</LabelStyle>
              <Controller
                name="Teachers"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={Array.isArray(teachersData?.findUserByRole?.users) ? teachersData.findUserByRole.users : []}
                    getOptionLabel={(user) => `${user.name.first} ${user.name.last}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    loading={teachersLoading}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => <RHFTextField {...params} name="Teachers" label="Teachers" />}
                  />
                )}
              />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Domain' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
