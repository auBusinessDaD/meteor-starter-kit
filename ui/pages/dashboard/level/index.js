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
import LevelList from './LevelList';

// queries & mutations
import { levels as levelsQuery } from '../../../_queries/Levels.gql';
import { removeLevel as removeLevelMutation } from '../../../_mutations/Levels.gql';
// ----------------------------------------------------------------------

export default function Level() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeLevel] = useMutation(removeLevelMutation);

  const { loading, data } = useQuery(levelsQuery);

  const levels = (data && data.levels) || [];

  const deleteLevel = (_id) => {
    const deleteLev = levels.find((doc) => doc._id === _id);
    
    removeLevel({
      variables: {
        _id
      },
      refetchQueries: [{ query: levelsQuery }]
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
    <Page title="Level">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Levels"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Levels' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.level.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Level
            </Button>
          }
        />
        <LevelList isLoading={loading} levelList={levels} onDelete={(id) => deleteLevel(id)} />
      </Container>
    </Page>
  );
}
