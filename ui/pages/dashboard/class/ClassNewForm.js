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
import { classes as classesQuery } from '../../../_queries/Classes.gql';
import { levels as levelsQuery } from '../../../_queries/Levels.gql';
import { strands as strandsQuery } from '../../../_queries/Strands.gql';
import { findUserByRole as usersQuery } from '../../../_queries/Users.gql';

// mutations
import {
  addClass as addClassMutation,
  updateClass as updateClassMutation
} from '../../../_mutations/Classes.gql';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

ClassNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClass: PropTypes.object
};

export default function ClassNewEditForm({ isEdit, currentClass }) {
  const [addClass] = useMutation(addClassMutation);
  const [updateClass] = useMutation(updateClassMutation);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: levelsData, loading: levelsLoading } = useQuery(levelsQuery);
  const { data: strandsData, loading: strandsLoading } = useQuery(strandsQuery);
  const { data: teachersData, loading: teachersLoading } = useQuery(usersQuery, {
    variables: { role: "teacher" },
  });
  const { data: studentsData, loading: studentsLoading } = useQuery(usersQuery, {
    variables: { role: "student" },
  });
  
  const NewClassSchema = Yup.object().shape({
    Class: Yup.string().required('Class is required')
  });

  const defaultValues = useMemo(() => {
    const selectedLevel =
      levelsData?.levels?.find((level) => level._id === currentClass?.Level) || null;

    const selectedStrand =
      strandsData?.strands?.find((strand) => strand._id === currentClass?.Strand) || null;

    const mappedTeacher =
      teachersData?.findUserByRole?.users?.find((user) => user._id === currentClass?.Teacher) || null;

    const mappedStudents =
      currentClass?.Students?.map((studentId) =>
        studentsData?.findUserByRole?.users?.find((user) => user._id === studentId)
      ) || [];
    
    return {
      Class: currentClass?.Class || '',
      Description: currentClass?.Description || '',
      Level: selectedLevel?._id || '',
      Strand: selectedStrand?._id || '',
      Year: currentClass?.Year || '',
      Semester: currentClass?.Semester || '',
      Teacher: mappedTeacher,
      Students: mappedStudents
    };
  }, [currentClass, levelsData, strandsData, teachersData, studentsData]);

  const methods = useForm({
    resolver: yupResolver(NewClassSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentClass) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentClass]);

  const onSubmit = async (values) => {
    try {
      const { Class, Description, Level, Strand, Year, Semester, Teacher, Students } = values;

      const mutation = isEdit ? updateClass : addClass;
      const classToAddOrUpdate = {
        Class,
        Description,
        Level,
        Strand,
        Year,
        Semester,
        Teacher: Teacher._id,
        Students: Students.map((student) => student._id)
      };

      if (isEdit) {
        classToAddOrUpdate._id = currentClass._id;
      };

      mutation({
        variables: {
          ...classToAddOrUpdate
        },
        refetchQueries: [{ query: classesQuery }]
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
        navigate(PATH_DASHBOARD.class.root);
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
              <RHFTextField name="Class" label="Class" />
              <RHFTextField name="Description" label="Description" />
              <RHFTextField name="Year" label="Year" />
              <RHFTextField name="Semester" label="Semester" />
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
              <LabelStyle>Teacher</LabelStyle>
              <Controller
                name="Teacher"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={teachersData?.findUserByRole.users || []}
                    getOptionLabel={(user) => `${user.name.first} ${user.name.last}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    loading={teachersLoading}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => <RHFTextField {...params} name="Teachers" label="Teachers" />}
                  />
                )}
              />
              <LabelStyle>Students</LabelStyle>
              <Controller
                name="Students"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={studentsData?.findUserByRole.users || []}
                    getOptionLabel={(user) => `${user.name.first} ${user.name.last}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    loading={studentsLoading}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => <RHFTextField {...params} name="Students" label="Students" />}
                  />
                )}
              />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Class' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
