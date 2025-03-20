import Classes from './Classes';
import { isAdmin } from '../Users/actions/checkIfAuthorized';

export default {
  addClass: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a class.');
    }

    const classToInsert = {
      Class: args.Class,
      Description: args.Description,
      Level: args.Level,
      Strand: args.Strand,
      Year: args.Year,
      Semester: args.Semester,
      Teacher: args.Teacher,
      Students: args.Students
    };

    const classId = Classes.insert(classToInsert);
    return { _id: classId, ...classToInsert };
  },
  updateClass: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a class.');
    }

    Classes.update(
      { _id: args._id },
      {
        $set: {
          Class: args.Class,
          Description: args.Description,
          Level: args.Level,
          Strand: args.Strand,
          Year: args.Year,
          Semester: args.Semester,
          Teacher: args.Teacher,
          Students: args.Students
        }
      }
    );

    const updatedClass = await Classes.findOne(args._id);
    return updatedClass;
  },
  removeClass: async (root, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you must be an admin to remove a class.');
    }

    Classes.remove(args._id);

    return { _id: args._id };
  },
};
