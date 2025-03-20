import Strands from './Strands';

export default {
  strands: async (parent, args, context) =>
    context.user ? (context.user._id ? Strands.find().fetch() : []) : [],
  strand: async (parent, args, context) =>
    Strands.findOne({
      _id: args._id
    }),
};
