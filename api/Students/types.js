export default `
  type Student {
    _id: String
    isPublic: Boolean
    title: String
    body: String
    cover: Cover
    owner: String
    createdAt: String
    updatedAt: String
    comments(sortBy: String): [Comment]
  }

  type Cover {
    url: String
    public_id: String
  }

  input CoverInput {
    url: String
    public_id: String
  }

`;
