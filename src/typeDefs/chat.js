import { gql } from "apollo-server-express";

export default gql`
  extends type Mutation {
    startChat(title: String, userIds: [ID!]!): Chat @auth
  }

  type Chat {
    id: ID!
    title: String!
    users: [User!]!
    messages: [Message!]!
    lastMessage: Message
    createdAt: String!
    updatedAt: String!
  }
`;
