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
import RatingNewForm from './RatingNewForm';

// queries
import { editRating as editRatingQuery } from '../../../_queries/Ratings.gql';

// ----------------------------------------------------------------------

export default function Rating() {
  const { ratingId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');
  const { data } = useQuery(editRatingQuery, { variables: { _id: ratingId } });
  const currentRating = (isEdit && data && data.rating) || {};

  return (
    <Page title="Rating">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Ratings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ratings', href: PATH_DASHBOARD.rating.root },
            { name: isEdit ? 'Edit Rating' : 'New Rating' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.rating.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <RatingNewForm currentRating={currentRating} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
