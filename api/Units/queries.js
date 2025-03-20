import Units from './Units';

export default {
  units: async (parent, args, context) =>
    context.user ? (context.user._id ? Units.find().fetch() : []) : [],
  unit: async (parent, args, context) =>
    Units.findOne({
      _id: args._id
    }),
};
