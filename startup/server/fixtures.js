import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Students from '../../api/Students/Students';
import Comments from '../../api/Comments/Comments';

const commentsSeed = (userId, date, studentId) => {
  seeder(Comments, {
    seedIfExistingData: true,
    environments: ['development', 'staging', 'production'],
    data: {
      dynamic: {
        count: 3,
        seed(commentIteration, faker) {
          return {
            userId,
            studentId,
            comment: faker.hacker.phrase(),
            createdAt: date,
          };
        },
      },
    },
  });
};

const studentsSeed = (userId) => {
  seeder(Students, {
    seedIfExistingData: true,
    environments: ['development', 'staging', 'production'],
    data: {
      dynamic: {
        count: 5,
        seed(iteration) {
          const date = new Date().toISOString();
          return {
            createdAt: date,
            updatedAt: date,
            code: `student-${iteration + 1}`,
            title: `Alex #${iteration + 1}`,
            body: `Smith #${iteration + 1}`,
            dependentData(studentId) {
              commentsSeed(userId, date, studentId);
            },
          };
        },
      },
    },
  });
};

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
        dependentData(userId) {
          studentsSeed(userId);
        },
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
          dependentData(userId) {
            studentsSeed(userId);
          },
        };
      },
    },
  },
});
