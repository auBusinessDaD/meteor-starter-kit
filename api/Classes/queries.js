import Classes from './Classes';

export default {
  classes: async (parent, args, context) =>
    context.user ? (context.user._id ? Classes.find().fetch() : []) : [],
  class: async (parent, args, context) =>
    Classes.findOne({
      _id: args._id
    }),
};
