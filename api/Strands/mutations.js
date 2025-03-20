import Strands from './Strands';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addStrand: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a strand.');
    }

    const strandToInsert = {
      Strand: args.Strand,
      Description: args.Description,
      Domain: args.Domain,
      ParentStrand: args.ParentStrand
    };

    const strandId = Strands.insert(strandToInsert);
    return { _id: strandId, ...strandToInsert };
  },
  updateStrand: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a strand.');
    }

    Strands.update(
      { _id: args._id },
      {
        $set: {
          Strand: args.Strand,
          Description: args.Description,
          Domain: args.Domain,
          ParentStrand: args.ParentStrand
        }
      }
    );

    const updatedStrand = await Strands.findOne(args._id);
    return updatedStrand;
  },
  removeStrand: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a strand.');
    }

    Strands.remove(args._id);

    return { _id: args._id };
  },
};
