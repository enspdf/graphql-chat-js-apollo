import Joi from "joi";
import { startChat } from "../schemas";
import { User, Chat } from "../models";
import { UserInputError } from "apollo-server-express";

export default {
  Mutation: {
    startChat: async (root, args, context, info) => {
      const { userId } = req.session;
      const { title, userIds } = args;

      await Joi.validate(args, startChat, { abortEarly: false });
      const idsFound = User.where("_id").in(userIds).countDocuments();

      if (idsFound !== userIds.length) {
        throw new UserInputError("One or more User IDs are invalid.");
      }

      userIds.push(userId);

      const chat = await Chat.create({ title, users: userIds });
      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $push: { chats: chat },
        }
      );

      return chat;
    },
  },
};
