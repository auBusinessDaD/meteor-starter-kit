import React from 'react';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';

// import queries
import { useQuery } from '@apollo/react-hooks';
// @mui
import { Button, Container } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import StudentNewForm from './StudentNewForm';

// queries
import { editStudent as editStudentQuery } from '../../../_queries/Students.gql';
// ----------------------------------------------------------------------

export default function Student() {
  const { studentId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editStudentQuery, { variables: { _id: studentId } });
  const currentStudent = (isEdit && data && data.student) || {};
  return (
    <Page title="Student">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Students"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Students', href: PATH_DASHBOARD.student.root },
            { name: isEdit ? 'Edit Documet' : 'New Student' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.student.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <StudentNewForm currentStudent={currentStudent} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
