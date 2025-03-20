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
import { units as unitsQuery } from '../../../_queries/Units.gql';
import { levels as levelsQuery } from '../../../_queries/Levels.gql';
import { strands as strandsQuery } from '../../../_queries/Strands.gql';

// mutations
import {
  addUnit as addUnitMutation,
  updateUnit as updateUnitMutation
} from '../../../_mutations/Units.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

UnitNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUnit: PropTypes.object
};

export default function UnitNewEditForm({ isEdit, currentUnit }) {
  const [addUnit] = useMutation(addUnitMutation);
  const [updateUnit] = useMutation(updateUnitMutation);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: levelsData, loading: levelsLoading } = useQuery(levelsQuery);
  const { data: strandsData, loading: strandsLoading } = useQuery(strandsQuery);
  
  const NewUnitSchema = Yup.object().shape({
    Unit: Yup.string().required('Unit is required'),
    Level: Yup.string().required('Level is required'),
    Strand: Yup.string().required('Strand is required')
  });

  const defaultValues = useMemo(() => {
    const selectedLevel =
      levelsData?.levels?.find((level) => level._id === currentUnit?.Level) || null;

    const selectedStrand =
      strandsData?.strands?.find((strand) => strand._id === currentUnit?.Strand) || null;

    return {
      Unit: currentUnit?.Unit || '',
      Description: currentUnit?.Description || '',
      Level: selectedLevel?._id || '',
      Strand: selectedStrand?._id || ''
    };
  }, [currentUnit, levelsData, strandsData]);

  const methods = useForm({
    resolver: yupResolver(NewUnitSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentUnit) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUnit]);

  const onSubmit = async (values) => {
    try {
      const { Unit, Description, Level, Strand } = values;

      const mutation = isEdit ? updateUnit : addUnit;
      const unitToAddOrUpdate = {
        Unit,
        Description,
        Level,
        Strand
      };

      if (isEdit) {
        unitToAddOrUpdate._id = currentUnit._id;
      };

      mutation({
        variables: {
          ...unitToAddOrUpdate
        },
        refetchQueries: [{ query: unitsQuery }]
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
        navigate(PATH_DASHBOARD.unit.root);
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
              <RHFTextField name="Unit" label="Unit" />
              <RHFTextField name="Description" label="Description" />
              <LabelStyle>Level</LabelStyle>
              <Controller
                name="Level"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={levelsData?.levels || []}
                    getOptionLabel={(option) => (option?.Level ? option.Level : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={levelsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?._id || '')}
                    value={levelsData?.levels?.find((level) => level._id === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="Level" label="Level" />
                    )}
                  />
                )}
              />
              <LabelStyle>Strand</LabelStyle>
              <Controller
                name="Strand"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={strandsData?.strands || []}
                    getOptionLabel={(option) => (option?.Strand ? option.Strand : '')}
                    isOptionEqualToValue={(option, value) => option === value}
                    loading={strandsLoading}
                    onChange={(_, newValue) => field.onChange(newValue?._id || '')}
                    value={strandsData?.strands?.find((strand) => strand._id === field.value) || null}
                    renderInput={(params) => (
                      <RHFTextField {...params} name="Strand" label="Strand" />
                    )}
                  />
                )}
              />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Unit' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
