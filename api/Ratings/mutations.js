import Ratings from './Ratings';

export default {
  addRating: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new rating.');

    const ratingId = await Ratings.insert({
      Rating: args.Rating,
      Description: args.Description,
      Colour: args.Colour
    });

    const newRating = await Ratings.findOne(ratingId);
    return newRating;
  },
  updateRating: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a rating.');

    Ratings.update(
      { _id: args._id },
      {
        $set: {
          Rating: args.Rating,
          Description: args.Description,
          Colour: args.Colour
        }
      }
    );

    const updatedRating = await Ratings.findOne(args._id);
    return updatedRating;
  },
  removeRating: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a rating.');

    await Ratings.remove(args);
    return args;
  }
};
