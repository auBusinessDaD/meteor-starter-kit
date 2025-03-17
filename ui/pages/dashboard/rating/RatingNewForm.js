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
  addRating as addRatingMutation,
  updateRating as updateRatingMutation
} from '../../../_mutations/Ratings.gql';
import { ratings as ratingsQuery } from '../../../_queries/Ratings.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

RatingNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRating: PropTypes.object
};

export default function RatingNewEditForm({ isEdit, currentRating }) {
  const [addRating] = useMutation(addRatingMutation);
  const [updateRating] = useMutation(updateRatingMutation);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewRatingSchema = Yup.object().shape({
    Rating: Yup.string().required('Rating is required'),
    Description: Yup.string().required('A description is required'),
    Colour: Yup.string().required('A colour needs to be selected')
  });

  const defaultValues = useMemo(
    () => ({
      Rating: currentRating?.Rating || '',
      Description: currentRating?.Description || '',
      Colour: currentRating?.Colour || ''
    }),
    [currentRating]
  );

  const methods = useForm({
    resolver: yupResolver(NewRatingSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentRating) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentRating]);

  const onSubmit = async (values) => {
    try {
      const { Rating, Description, Colour } = values;

      const mutation = isEdit ? updateRating : addRating;
      const ratingToAddOrUpdate = {
        Rating,
        Description,
        Colour
      };

      if (isEdit) {
        ratingToAddOrUpdate._id = currentRating._id;
      };

      mutation({
        variables: {
          ...ratingToAddOrUpdate
        },
        refetchQueries: [{ query: ratingsQuery }]
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
        navigate(PATH_DASHBOARD.rating.root);
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
              <RHFTextField name="Rating" label="Rating" />
              <RHFTextField name="Description" label="Description" />
              <RHFTextField name="Colour" label="Colour" />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Rating' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
