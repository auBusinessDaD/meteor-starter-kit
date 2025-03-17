import Students from './Students';

export default {
  students: async (parent, args, context) =>
    context.user ? (context.user._id ? Students.find({ owner: context.user._id }).fetch() : []) : [],
  student: async (parent, args, context) =>
    Students.findOne({
      _id: args._id, owner: context.user ? (context.user._id ? context.user._id : null) : null
    }),
};
