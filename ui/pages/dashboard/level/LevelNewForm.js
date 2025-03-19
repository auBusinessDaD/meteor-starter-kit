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
  addLevel as addLevelMutation,
  updateLevel as updateLevelMutation
} from '../../../_mutations/Levels.gql';
import { levels as levelsQuery } from '../../../_queries/Levels.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

LevelNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLevel: PropTypes.object
};

export default function LevelNewEditForm({ isEdit, currentLevel }) {
  const [addLevel] = useMutation(addLevelMutation);
  const [updateLevel] = useMutation(updateLevelMutation);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewLevelSchema = Yup.object().shape({
    Level: Yup.string().required('Level is required')
  });

  const defaultValues = useMemo(
    () => ({
      Level: currentLevel?.Level || '',
      Description: currentLevel?.Description || ''
    }),
    [currentLevel]
  );

  const methods = useForm({
    resolver: yupResolver(NewLevelSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentLevel) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentLevel]);

  const onSubmit = async (values) => {
    try {
      const { Level, Description } = values;

      const mutation = isEdit ? updateLevel : addLevel;
      const levelToAddOrUpdate = {
        Level,
        Description
      };

      if (isEdit) {
        levelToAddOrUpdate._id = currentLevel._id;
      };

      mutation({
        variables: {
          ...levelToAddOrUpdate
        },
        refetchQueries: [{ query: levelsQuery }]
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
        navigate(PATH_DASHBOARD.level.root);
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
              <RHFTextField name="Level" label="Level" />
              <RHFTextField name="Description" label="Description" />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Level' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
