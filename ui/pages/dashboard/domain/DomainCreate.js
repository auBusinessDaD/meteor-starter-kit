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
import DomainNewForm from './DomainNewForm';

// queries
import { editDomain as editDomainQuery } from '../../../_queries/Domains.gql';

// ----------------------------------------------------------------------

export default function Domain() {
  const { domainId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editDomainQuery, { variables: { _id: domainId } });
  const currentDomain = (isEdit && data && data.domain) || {};

  return (
    <Page title="Domain">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Domains"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Domains', href: PATH_DASHBOARD.domain.root },
            { name: isEdit ? 'Edit Domain' : 'New Domain' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.domain.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <DomainNewForm currentDomain={currentDomain} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
