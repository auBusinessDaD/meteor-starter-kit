import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

import { Cloudinary } from 'meteor/socialize:cloudinary';

// import queries
import { useQuery, useMutation } from '@apollo/react-hooks';

// @mui
import { Button, Container, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import StudentList from './StudentList';

// queries & mutations
import { students as studentsQuery } from '../../../_queries/Students.gql';
import { removeStudent as removeStudentMutation } from '../../../_mutations/Students.gql';
// ----------------------------------------------------------------------

export default function Student() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeStudent] = useMutation(removeStudentMutation);

  const { loading, data } = useQuery(studentsQuery);

  const students = (data && data.students) || [];

  const deleteStudent = (_id) => {
    const deleteStu = students.find((doc) => doc._id === _id);
    const public_id = deleteStu && deleteStu.cover && deleteStu.cover.public_id;
    removeStudent({
      variables: {
        _id
      },
      refetchQueries: [{ query: studentsQuery }]
    }).then(async (res) => {
      if (public_id) {
        await Cloudinary.delete(public_id);

        enqueueSnackbar('Deleted successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
      }
    });
  };

  return (
    <Page title="Student">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Students"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Students' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.student.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Student
            </Button>
          }
        />
        <StudentList isLoading={loading} studentList={students} onDelete={(id) => deleteStudent(id)} />
      </Container>
    </Page>
  );
}
