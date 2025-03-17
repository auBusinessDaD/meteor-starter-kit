import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

import { Cloudinary } from 'meteor/socialize:cloudinary';

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
import RatingList from './RatingList';

// queries & mutations
import { ratings as ratingsQuery } from '../../../_queries/Ratings.gql';
import { removeRating as removeRatingMutation } from '../../../_mutations/Ratings.gql';
// ----------------------------------------------------------------------

export default function Rating() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeRating] = useMutation(removeRatingMutation);

  const { loading, data } = useQuery(ratingsQuery);

  const ratings = (data && data.ratings) || [];

  const deleteRating = (_id) => {
    const deleteStu = ratings.find((doc) => doc._id === _id);
    const public_id = deleteStu && deleteStu.cover && deleteStu.cover.public_id;
    removeRating({
      variables: {
        _id
      },
      refetchQueries: [{ query: ratingsQuery }]
    }).then(async (res) => {
      if (public_id) {
        await Cloudinary.delete(public_id);

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
    <Page title="Rating">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Ratings"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Ratings' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.rating.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Rating
            </Button>
          }
        />
        <RatingList isLoading={loading} ratingList={ratings} onDelete={(id) => deleteRating(id)} />
      </Container>
    </Page>
  );
}
