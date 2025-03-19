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
import LevelNewForm from './LevelNewForm';

// queries
import { editLevel as editLevelQuery } from '../../../_queries/Levels.gql';

// ----------------------------------------------------------------------

export default function Level() {
  const { levelId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editLevelQuery, { variables: { _id: levelId } });
  const currentLevel = (isEdit && data && data.level) || {};

  return (
    <Page title="Level">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Levels"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Levels', href: PATH_DASHBOARD.level.root },
            { name: isEdit ? 'Edit Level' : 'New Level' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.level.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <LevelNewForm currentLevel={currentLevel} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
