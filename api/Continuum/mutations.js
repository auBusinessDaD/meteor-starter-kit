import Continuum from './Continuum';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addCont: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a cont.');
    }

    const contToInsert = {
      Entry: args.Entry,
      Description: args.Description,
      Rating: args.Rating,
      Unit: args.Unit,
      Teacher: {
        _id: context.user._id,
        given: context.user.profile.name.first,
        family: context.user.profile.name.last
      },
      Student: args.Student,
      CreatedAt: new Date().toISOString()
    };

    const contId = Continuum.insert(contToInsert);
    return { _id: contId, ...contToInsert };
  },
  updateCont: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a cont.');
    }

    Continuum.update(
      { _id: args._id },
      {
        $set: {
          Entry: args.Entry,
          Description: args.Description,
          Rating: args.Rating,
          Unit: args.Unit,
          Teacher: {
            _id: context.user._id,
            given: context.user.profile.name.first,
            family: context.user.profile.name.last
          },
          Student: args.Student,
          UpdatedAt: new Date().toISOString()
        }
      }
    );

    const updatedCont = await Continuum.findOne(args._id);
    return updatedCont;
  },
  removeCont: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a cont.');
    }

    Continuum.remove(args._id);

    return { _id: args._id };
  },
};
