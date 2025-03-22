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
import ContList from './ContList';

// queries & mutations
import { continuum as continuumQuery } from '../../../_queries/Continuum.gql';
import { removeCont as removeContMutation } from '../../../_mutations/Continuum.gql';
// ----------------------------------------------------------------------

export default function Cont() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeCont] = useMutation(removeContMutation);

  const { loading, data } = useQuery(continuumQuery);

  const continuum = (data && data.continuum) || [];

  const deleteCont = (_id) => {
    const deleteLev = continuum.find((doc) => doc._id === _id);
    
    removeCont({
      variables: {
        _id
      },
      refetchQueries: [{ query: continuumQuery }]
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
    <Page title="Continuum Entries">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Continuum"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Continuum' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.cont.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Entry
            </Button>
          }
        />
        <ContList isLoading={loading} contList={continuum} onDelete={(id) => deleteCont(id)} />
      </Container>
    </Page>
  );
}
