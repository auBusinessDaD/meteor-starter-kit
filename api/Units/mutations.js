import Units from './Units';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addUnit: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a unit.');
    }

    const unitToInsert = {
      Unit: args.Unit,
      Description: args.Description,
      Level: args.Level,
      Strand: args.Strand
    };

    const unitId = Units.insert(unitToInsert);
    return { _id: unitId, ...unitToInsert };
  },
  updateUnit: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a unit.');
    }

    Units.update(
      { _id: args._id },
      {
        $set: {
          Unit: args.Unit,
          Description: args.Description,
          Level: args.Level,
          Strand: args.Strand
        }
      }
    );

    const updatedUnit = await Units.findOne(args._id);
    return updatedUnit;
  },
  removeUnit: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a unit.');
    }

    Units.remove(args._id);

    return { _id: args._id };
  },
};
