import { Meteor } from 'meteor/meteor';
import checkIfAuthorized from './checkIfAuthorized';
import mapMeteorUserToSchema from './mapMeteorUserToSchema';

/* eslint-disable consistent-return */

let action;

const getTotalUserCount = (currentUserId) => {
  try {
    return Meteor.users.find({ _id: { $ne: currentUserId } }).count();
  } catch (exception) {
    throw new Error(`[queryByRoles.getTotalUserCount] ${exception.message}`);
  }
};

const getUsers = (options) => {
  try {
    const users = Meteor.users
      .find({ roles: options.role })
      .fetch()
      .map((user) => mapMeteorUserToSchema({ user }));

    return users;
  } catch (exception) {
    throw new Error(`[queryByRoles.getUsers] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.currentUser) throw new Error('options.currentUser is required.');
  } catch (exception) {
    throw new Error(`[queryByRoles.validateOptions] ${exception.message}`);
  }
};

const queryByRoles = (options) => {
  try {
    validateOptions(options);
    checkIfAuthorized({ as: ['admin'], userId: options.currentUser._id });

    action.resolve({
      total: getTotalUserCount(options.currentUser._id),
      users: getUsers(options),
    });
  } catch (exception) {
    action.reject(`[queryByRoles] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    action = { resolve, reject };
    queryByRoles(options);
  });
