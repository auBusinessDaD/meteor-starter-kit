import Levels from './Levels';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addLevel: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

    const levelToInsert = {
      Level: args.Level,
      Description: args.Description,
    };

    const levelId = Levels.insert(levelToInsert);
    return { _id: levelId, ...levelToInsert };
  },
  updateLevel: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

    Levels.update(
      { _id: args._id },
      {
        $set: {
          Level: args.Level,
          Description: args.Description
        }
      }
    );

    const updatedLevel = await Levels.findOne(args._id);
    return updatedLevel;
  },
  removeLevel: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a level.');
    }

    Levels.remove(args._id);

    return { _id: args._id };
  },
};
