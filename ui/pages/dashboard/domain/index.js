import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

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
import DomainList from './DomainList';

// queries & mutations
import { domains as domainsQuery } from '../../../_queries/Domains.gql';
import { removeDomain as removeDomainMutation } from '../../../_mutations/Domains.gql';
// ----------------------------------------------------------------------

export default function Domain() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeDomain] = useMutation(removeDomainMutation);

  const { loading, data } = useQuery(domainsQuery);

  const domains = (data && data.domains) || [];

  const deleteDomain = (_id) => {
    const deleteLev = domains.find((doc) => doc._id === _id);
    
    removeDomain({
      variables: {
        _id
      },
      refetchQueries: [{ query: domainsQuery }]
    }).then(async (res) => {
      if (deleteLev) {
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
    <Page title="Domain">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Domains"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Domains' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.domain.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Domain
            </Button>
          }
        />
        <DomainList isLoading={loading} domainList={domains} onDelete={(id) => deleteDomain(id)} />
      </Container>
    </Page>
  );
}
