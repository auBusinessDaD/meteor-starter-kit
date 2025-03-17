/* eslint-disable consistent-return */

import JSZip from 'jszip';
import Students from '../../Students/Students';
import checkIfAuthorized, { isAdmin } from './checkIfAuthorized';

let action;

const generateZip = (zip) => {
  try {
    zip.generateAsync({ type: 'base64' }).then((content) => action.resolve({ zip: content }));
  } catch (exception) {
    throw new Error(`[exportUserData.generateZip] ${exception.message}`);
  }
};

const addStudentsToZip = (students, zip) => {
  try {
    students.forEach((student) => {
      zip.file(`${student.code}.txt`, `${student.code}\n\n${student.givenName}\n\n${student.familyName}`);
    });
  } catch (exception) {
    throw new Error(`[exportUserData.addStudentsToZip] ${exception.message}`);
  }
};

const getStudents = async () => {
  try {
    return await Students.find({}, { fields: { code: 1, givenName: 1, familyName: 1 } }).fetch();
  } catch (exception) {
    throw new Error(`[exportUserData.getStudents] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.user) throw new Error('options.user is required.');
  } catch (exception) {
    throw new Error(`[exportUserData.validateOptions] ${exception.message}`);
  }
};

const exportUserData = (options) => {
  checkIfAuthorized({
    as: ['admin', () => !options.user._id],
    userId: options.currentUser._id,
    errorMessage: 'Sorry, you need to be an admin or the passed user to do this.',
  });

  try {
    validateOptions(options);
    const zip = new JSZip();
    const students = getStudents(options.user);
    addStudentsToZip(students, zip);
    generateZip(zip);
  } catch (exception) {
    action.reject(`[exportUserData] ${exception.message}`);
  }
};

export default (options) => {
  return new Promise((resolve, reject) => {
    action = { resolve, reject };
    exportUserData(options);
  });
};
