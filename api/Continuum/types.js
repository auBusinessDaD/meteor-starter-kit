export default `
  type Cont {
    _id: String
    Entry: String
    Description: String
    Rating: String
    Unit: String
    Teacher: UserInfo
    Student: UserInfo
    CreatedAt: String
  }

  type UserInfo {
    _id: String
    given: String
    family: String
  }
  
  input UserInfoInput {
    _id: String!
    given: String
    family: String
  }
`;
