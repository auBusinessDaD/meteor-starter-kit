import Ratings from './Ratings';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addRating: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

    const ratingId = await Ratings.insert({
      Rating: args.Rating,
      Description: args.Description,
      Colour: args.Colour
    });

    const newRating = await Ratings.findOne(ratingId);
    return newRating;
  },
  updateRating: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

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
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

    await Ratings.remove(args);
    return args;
  }
};
