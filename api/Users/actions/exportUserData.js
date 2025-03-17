/* eslint-disable consistent-return */

import JSZip from 'jszip';
import Ratings from '../../Ratings/Ratings';
import checkIfAuthorized, { isAdmin } from './checkIfAuthorized';

let action;

const generateZip = (zip) => {
  try {
    zip.generateAsync({ type: 'base64' }).then((content) => action.resolve({ zip: content }));
  } catch (exception) {
    throw new Error(`[exportUserData.generateZip] ${exception.message}`);
  }
};

const addRatingsToZip = (ratings, zip) => {
  try {
    ratings.forEach((rating) => {
      zip.file(`${rating.Rating}.txt`, `${rating.Rating}\n\n${rating.Description}\n\n${rating.Colour}`);
    });
  } catch (exception) {
    throw new Error(`[exportUserData.addRatingsToZip] ${exception.message}`);
  }
};

const getRatings = async () => {
  try {
    return await Ratings.find({}, { fields: { Rating: 1, Description: 1, Colour: 1 } }).fetch();
  } catch (exception) {
    throw new Error(`[exportUserData.getRatings] ${exception.message}`);
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
    const ratings = getRatings(options.user);
    addRatingsToZip(ratings, zip);
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
