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
import ClassList from './ClassList';

// queries & mutations
import { classes as classesQuery } from '../../../_queries/Classes.gql';
import { removeClass as removeClassMutation } from '../../../_mutations/Classes.gql';
// ----------------------------------------------------------------------

export default function Class() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeClass] = useMutation(removeClassMutation);

  const { loading, data } = useQuery(classesQuery);

  const classes = (data && data.classes) || [];

  const deleteClass = (_id) => {
    const deleteLev = classes.find((doc) => doc._id === _id);
    
    removeClass({
      variables: {
        _id
      },
      refetchQueries: [{ query: classesQuery }]
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
    <Page title="Class">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Classes"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Classes' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.class.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Class
            </Button>
          }
        />
        <ClassList isLoading={loading} classList={classes} onDelete={(id) => deleteClass(id)} />
      </Container>
    </Page>
  );
}
