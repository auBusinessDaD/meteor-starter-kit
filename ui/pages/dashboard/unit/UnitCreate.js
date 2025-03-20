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
import UnitNewForm from './UnitNewForm';

// queries
import { editUnit as editUnitQuery } from '../../../_queries/Units.gql';

// ----------------------------------------------------------------------

export default function Unit() {
  const { unitId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editUnitQuery, { variables: { _id: unitId } });
  const currentUnit = (isEdit && data && data.unit) || {};

  return (
    <Page title="Unit">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Units"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Units', href: PATH_DASHBOARD.unit.root },
            { name: isEdit ? 'Edit Unit' : 'New Unit' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.unit.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <UnitNewForm currentUnit={currentUnit} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
