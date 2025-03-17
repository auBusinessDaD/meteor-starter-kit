import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import StudentTypes from '../../api/Students/types';
import StudentQueries from '../../api/Students/queries';
import StudentMutations from '../../api/Students/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Students/server/indexes';
import '../../api/webhooks';

import '../../api/App/server/publications';

import '../../api/Users/methods';


const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${StudentTypes}
    ${CommentTypes}
    ${UserSettingsTypes}

    type Query {
      students: [Student]
      student(_id: String): Student
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addStudent(code: String, givenName: String, familyName: String): Student
      updateStudent(_id: String!, code: String, givenName: String, familyName: String): Student
      removeStudent(_id: String!): Student
      addComment(studentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
      sendWelcomeEmail: User
    }

    type Subscription {
      commentAdded(studentId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...StudentQueries,
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries,
    },
    Mutation: {
      ...StudentMutations,
      ...CommentMutations,
      ...UserMutations,
      ...UserSettingsMutations,
    },
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default makeExecutableSchema(schema);
