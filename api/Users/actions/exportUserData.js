/* eslint-disable consistent-return */

import JSZip from 'jszip';
import Students from '../../Students/Students';

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
      zip.file(`${student.title}.txt`, `${student.title}\n\n${student.body}`);
    });
  } catch (exception) {
    throw new Error(`[exportUserData.addStudentsToZip] ${exception.message}`);
  }
};

const getStudents = ({ _id }) => {
  try {
    return Students.find({ owner: _id }).fetch();
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

export default (options) =>
  new Promise((resolve, reject) => {
    action = { resolve, reject };
    exportUserData(options);
  });
