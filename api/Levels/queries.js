import Levels from './Levels';

export default {
  levels: async (parent, args, context) =>
    context.user ? (context.user._id ? Levels.find().fetch() : []) : [],
  level: async (parent, args, context) =>
    Levels.findOne({
      _id: args._id
    }),
};
