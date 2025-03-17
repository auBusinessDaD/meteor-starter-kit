import Ratings from './Ratings';

export default {
  ratings: async (parent, args, context) =>
    context.user ? (context.user._id ? Ratings.find().fetch() : []) : [],
  rating: async (parent, args, context) =>
    Ratings.findOne({
      _id: args._id
    }),
};
