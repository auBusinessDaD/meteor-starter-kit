import Continuum from './Continuum';

export default {
  continuum: async (parent, args, context) =>
    context.user ? (context.user._id ? Continuum.find().fetch() : []) : [],
  cont: async (parent, args, context) =>
    Continuum.findOne({
      _id: args._id
    }),
};
