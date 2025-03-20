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
import StrandNewForm from './StrandNewForm';

// queries
import { editStrand as editStrandQuery } from '../../../_queries/Strands.gql';

// ----------------------------------------------------------------------

export default function Strand() {
  const { strandId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editStrandQuery, { variables: { _id: strandId } });
  const currentStrand = (isEdit && data && data.strand) || {};

  return (
    <Page title="Strand">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Strands"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Strands', href: PATH_DASHBOARD.strand.root },
            { name: isEdit ? 'Edit Strand' : 'New Strand' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.strand.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <StrandNewForm currentStrand={currentStrand} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
