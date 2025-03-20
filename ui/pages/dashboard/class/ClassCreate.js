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
import ClassNewForm from './ClassNewForm';

// queries
import { editClass as editClassQuery } from '../../../_queries/Classes.gql';

// ----------------------------------------------------------------------

export default function Class() {
  const { classId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editClassQuery, { variables: { _id: classId } });
  const currentClass = (isEdit && data && data.class) || {};

  return (
    <Page title="Class">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Classes"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Classes', href: PATH_DASHBOARD.class.root },
            { name: isEdit ? 'Edit Class' : 'New Class' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.class.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <ClassNewForm currentClass={currentClass} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
