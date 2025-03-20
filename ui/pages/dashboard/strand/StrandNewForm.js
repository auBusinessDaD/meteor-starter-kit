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
import { strands as strandsQuery } from '../../../_queries/Strands.gql';
import { domains as domainsQuery } from '../../../_queries/Domains.gql';

// mutations
import {
  addStrand as addStrandMutation,
  updateStrand as updateStrandMutation
} from '../../../_mutations/Strands.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

StrandNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentStrand: PropTypes.object
};

export default function StrandNewEditForm({ isEdit, currentStrand }) {
  const [addStrand] = useMutation(addStrandMutation);
  const [updateStrand] = useMutation(updateStrandMutation);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: domainsData, loading: domainsLoading } = useQuery(domainsQuery);
  const { data: strandsData, loading: strandsLoading } = useQuery(strandsQuery);
  
  const NewStrandSchema = Yup.object().shape({
    Strand: Yup.string().required('Strand is required'),
    Domain: Yup.string().required('Domain is required')
  });

  const defaultValues = useMemo(() => {
    const selectedDomain =
      domainsData?.domains?.find((domain) => domain._id === currentStrand?.Domain) || null;

    const selectedStrand =
      strandsData?.strands?.find((strand) => strand._id === currentStrand?.ParentStrand) || null;

    return {
      Strand: currentStrand?.Strand || '',
      Description: currentStrand?.Description || '',
      Domain: selectedDomain?._id || '', // Store the domain ID
      ParentStrand: selectedStrand?._id || '' // Store the parent strand ID
    };
  }, [currentStrand, domainsData, strandsData]);

  const methods = useForm({
    resolver: yupResolver(NewStrandSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentStrand) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentStrand]);

  const onSubmit = async (values) => {
    try {
      const { Strand, Description, Domain, ParentStrand } = values;

      const mutation = isEdit ? updateStrand : addStrand;
      const strandToAddOrUpdate = {
        Strand,
        Description,
        Domain,
        ParentStrand
      };

      if (isEdit) {
        strandToAddOrUpdate._id = currentStrand._id;
      };

      mutation({
        variables: {
          ...strandToAddOrUpdate
        },
        refetchQueries: [{ query: strandsQuery }]
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
        navigate(PATH_DASHBOARD.strand.root);
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
              <RHFTextField name="Strand" label="Strand" />
              <RHFTextField name="Description" label="Description" />
              <LabelStyle>Domain</LabelStyle>
              <Controller
                name="Domain"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={domainsData?.domains || []}
                    getOptionLabel={(option) => (option?.Domain ? option.Domain : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={domainsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?._id || '')}
                    value={domainsData?.domains?.find((domain) => domain._id === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="Domain" label="Domain" />
                    )}
                  />
                )}
              />
              <LabelStyle>Parent Strand</LabelStyle>
              <Controller
                name="ParentStrand"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={strandsData?.strands?.filter((strand) => strand._id !== currentStrand?._id) || []}
                    getOptionLabel={(option) => (option?.Strand ? option.Strand : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={strandsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?._id || '')}
                    value={strandsData?.strands?.find((strand) => strand._id === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="ParentStrand" label="Parent Strand" />
                    )}
                  />
                )}
              />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Strand' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
