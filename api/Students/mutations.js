import sanitizeHtml from 'sanitize-html';
import Students from './Students';

export default {
  addStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new student.');

    const date = new Date().toISOString();
    const studentId = Students.insert({
      isPublic: args.isPublic || false,
      title: args.title || `Untitled Student #${Students.find({ owner: context.user._id }).count() + 1}`,
      body: args.body ? sanitizeHtml(args.body) : 'This is my student. There are many like it, but this one is mine.',
      cover: args.cover,
      owner: context.user._id,
      createdAt: date,
      updatedAt: date
    });
    const doc = Students.findOne(studentId);
    return doc;
  },
  updateStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a student.');
    if (!Students.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this student to update it.');
    Students.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          body: sanitizeHtml(args.body),
          updatedAt: new Date().toISOString()
        }
      }
    );
    const doc = Students.findOne(args._id);
    return doc;
  },
  removeStudent: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a student.');
    if (!Students.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this student to remove it.');
    Students.remove(args);
    return args;
  }
};
