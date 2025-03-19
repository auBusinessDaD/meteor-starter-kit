import Domains from './Domains';

export default {
  domains: async (parent, args, context) =>
    context.user ? (context.user._id ? Domains.find().fetch() : []) : [],
  domain: async (parent, args, context) =>
    Domains.findOne({
      _id: args._id
    }),
};
