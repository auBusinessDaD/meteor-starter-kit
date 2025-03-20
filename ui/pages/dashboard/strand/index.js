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
import StrandList from './StrandList';

// queries & mutations
import { strands as strandsQuery } from '../../../_queries/Strands.gql';
import { removeStrand as removeStrandMutation } from '../../../_mutations/Strands.gql';
// ----------------------------------------------------------------------

export default function Strand() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeStrand] = useMutation(removeStrandMutation);

  const { loading, data } = useQuery(strandsQuery);

  const strands = (data && data.strands) || [];

  const deleteStrand = (_id) => {
    const deleteLev = strands.find((doc) => doc._id === _id);
    
    removeStrand({
      variables: {
        _id
      },
      refetchQueries: [{ query: strandsQuery }]
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
    <Page title="Strand">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Strands"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Strands' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.strand.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Strand
            </Button>
          }
        />
        <StrandList isLoading={loading} strandList={strands} onDelete={(id) => deleteStrand(id)} />
      </Container>
    </Page>
  );
}
