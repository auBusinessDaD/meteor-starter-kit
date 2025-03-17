import sanitizeHtml from 'sanitize-html';
import Students from './Students';
import { update } from 'lodash';

export default {
  addStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new student.');

    const date = new Date().toISOString();
    const studentId = await Students.insert({
      code: args.code,
      givenName: args.givenName,
      familyName: args.familyName,
      createdAt: date,
      updatedAt: date
    });

    const stu = await Students.findOne(studentId);
    return stu;
  },
  updateStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a student.');
    if (!await Students.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this student to update it.');

    await Students.update(
      { _id: args._id },
      {
        $set: {
          code: args.code,
          givenName: args.givenName,
          familyName: args.familyName,
          body: sanitizeHtml(args.body),
          updatedAt: new Date().toISOString()
        }
      }
    );

    const stu = await Students.findOne(args._id);
    return stu;
  },
  removeStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a student.');
    if (!await Students.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this student to remove it.');

    await Students.remove(args);
    return args;
  }
};
