import Domains from './Domains';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addDomain: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a domain.');
    }

    const domainToInsert = {
      Domain: args.Domain,
      Description: args.Description,
      Teachers: args.Teachers,
    };

    const domainId = Domains.insert(domainToInsert);
    return { _id: domainId, ...domainToInsert };
  },
  updateDomain: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a domain.');
    }

    Domains.update(
      { _id: args._id },
      {
        $set: {
          Domain: args.Domain,
          Description: args.Description,
          Teachers: args.Teachers
        }
      }
    );

    const updatedDomain = await Domains.findOne(args._id);
    return updatedDomain;
  },
  removeDomain: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a domain.');
    }

    Domains.remove(args._id);

    return { _id: args._id };
  },
};
