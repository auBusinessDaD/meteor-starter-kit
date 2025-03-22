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
import ContNewForm from './ContNewForm';

// queries
import { editCont as editContQuery } from '../../../_queries/Continuum.gql';

// ----------------------------------------------------------------------

export default function Cont() {
  const { contId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editContQuery, { variables: { _id: contId } });
  const currentCont = (isEdit && data && data.cont) || {};

  return (
    <Page title="Cont">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Continuum"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Continuum', href: PATH_DASHBOARD.cont.root },
            { name: isEdit ? 'Edit Entry' : 'New Entry' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.cont.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <ContNewForm currentCont={currentCont} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
