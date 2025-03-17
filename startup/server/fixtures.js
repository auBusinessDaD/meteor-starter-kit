import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';

seeder(Meteor.users, {
  seedIfExistingData: true,
  environments: ['development', 'staging', 'production'],
  data: {
    static: [
      {
        email: 'daniel@pasme.com.au',
        password: 'password',
        profile: {
          name: {
            first: 'Daniel',
            last: 'Lewis',
          },
        },
        roles: ['admin'],
      },
    ],
    dynamic: {
      count: 5,
      seed(iteration, faker) {
        const userCount = iteration + 1;
        return {
          email: `user+${userCount}@test.com`,
          password: 'password',
          profile: {
            name: {
              first: faker.name.firstName(),
              last: faker.name.lastName(),
            },
          },
          roles: ['user'],
        };
      },
    },
  },
});
