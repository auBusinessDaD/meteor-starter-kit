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
import UnitList from './UnitList';

// queries & mutations
import { units as unitsQuery } from '../../../_queries/Units.gql';
import { removeUnit as removeUnitMutation } from '../../../_mutations/Units.gql';
// ----------------------------------------------------------------------

export default function Unit() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeUnit] = useMutation(removeUnitMutation);

  const { loading, data } = useQuery(unitsQuery);

  const units = (data && data.units) || [];

  const deleteUnit = (_id) => {
    const deleteLev = units.find((doc) => doc._id === _id);
    
    removeUnit({
      variables: {
        _id
      },
      refetchQueries: [{ query: unitsQuery }]
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
    <Page title="Unit">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Units"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Units' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.unit.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Unit
            </Button>
          }
        />
        <UnitList isLoading={loading} unitList={units} onDelete={(id) => deleteUnit(id)} />
      </Container>
    </Page>
  );
}
