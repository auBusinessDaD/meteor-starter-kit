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

import LevelTypes from '../../api/Levels/types';
import LevelQueries from '../../api/Levels/queries';
import LevelMutations from '../../api/Levels/mutations';

import DomainTypes from '../../api/Domains/types';
import DomainQueries from '../../api/Domains/queries';
import DomainMutations from '../../api/Domains/mutations';

import StrandTypes from '../../api/Strands/types';
import StrandQueries from '../../api/Strands/queries';
import StrandMutations from '../../api/Strands/mutations';

import UnitTypes from '../../api/Units/types';
import UnitQueries from '../../api/Units/queries';
import UnitMutations from '../../api/Units/mutations';

import ClassTypes from '../../api/Classes/types';
import ClassQueries from '../../api/Classes/queries';
import ClassMutations from '../../api/Classes/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Ratings/server/indexes';
import '../../api/webhooks';

import '../../api/App/server/publications';

import '../../api/Users/methods';


const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${RatingTypes}
    ${LevelTypes}
    ${StrandTypes}
    ${UnitTypes}
    ${ClassTypes}
    ${DomainTypes}
    ${UserSettingsTypes}

    type Query {
      ratings: [Rating]
      rating(_id: String): Rating
      levels: [Level]
      level(_id: String): Level
      domains: [Domain]
      domain(_id: String): Domain
      strands: [Strand]
      strand(_id: String): Strand
      units: [Unit]
      unit(_id: String): Unit
      classes: [Class]
      class(_id: String): Class
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      findUserByRole(role: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addRating(Rating: String!, Description: String!, Colour: String!): Rating
      updateRating(_id: String!, Rating: String!, Description: String!, Colour: String!): Rating
      removeRating(_id: String!): Rating
      addLevel(Level: String!, Description: String): Level
      updateLevel(_id: String!, Level: String!, Description: String): Level
      removeLevel(_id: String!): Level
      addDomain(Domain: String!, Description: String, Teachers: [String]): Domain
      updateDomain(_id: String!, Domain: String!, Description: String, Teachers: [String]): Domain
      removeDomain(_id: String!): Domain
      addStrand(Strand: String!, Description: String, Domain: String, ParentStrand: String): Strand
      updateStrand(_id: String!, Strand: String!, Description: String, Domain: String, ParentStrand: String): Strand
      removeStrand(_id: String!): Strand
      addUnit(Unit: String!, Description: String, Level: String, Strand: String): Unit
      updateUnit(_id: String!, Unit: String!, Description: String, Level: String, Strand: String): Unit
      removeUnit(_id: String!): Unit
      addClass(Class: String!, Description: String, Level: String, Strand: String, Year: String, Semester: String, Teacher: String, Students: [String]): Class
      updateClass(_id: String!, Class: String!, Description: String, Level: String, Strand: String, Year: String, Semester: String, Teacher: String, Students: [String]): Class
      removeClass(_id: String!): Class
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
      sendWelcomeEmail: User
    }
  `,
  resolvers: {
    Query: {
      ...RatingQueries,
      ...LevelQueries,
      ...DomainQueries,
      ...StrandQueries,
      ...UnitQueries,
      ...ClassQueries,
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries,
    },
    Mutation: {
      ...RatingMutations,
      ...LevelMutations,
      ...DomainMutations,
      ...StrandMutations,
      ...UnitMutations,
      ...ClassMutations,
      ...UserMutations,
      ...UserSettingsMutations,
    },
  },
};

export default makeExecutableSchema(schema);
