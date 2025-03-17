import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import RatingTypes from '../../api/Ratings/types';
import RatingQueries from '../../api/Ratings/queries';
import RatingMutations from '../../api/Ratings/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Ratings/server/indexes';
import '../../api/webhooks';

import '../../api/App/server/publications';

import '../../api/Users/methods';


const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${RatingTypes}
    ${CommentTypes}
    ${UserSettingsTypes}

    type Query {
      ratings: [Rating]
      rating(_id: String): Rating
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addRating(Rating: String!, Description: String!, Colour: String!): Rating
      updateRating(_id: String!, Rating: String!, Description: String!, Colour: String!): Rating
      removeRating(_id: String!): Rating
      addComment(ratingId: String!, comment: String!): Comment
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
      commentAdded(ratingId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...RatingQueries,
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries,
    },
    Mutation: {
      ...RatingMutations,
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
