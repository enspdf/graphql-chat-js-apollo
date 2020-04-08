import Joi from "joi";
import mongoose from "mongoose";
import { UserInputError } from "apollo-server-express";
import { signUp, signIn, objectId } from "../schemas";
import { User } from "../models";
import { attemptSignIn, signOut } from "../auth";

export default {
  Query: {
    me: (root, args, { req }, info) => {
      return User.findById(req.session.userId);
    },
    users: (root, args, { req }, info) => {
      return User.find({});
    },
    user: async (root, args, { req }, info) => {
      await Joi.validate(args, objectId);

      return User.findById(args.id);
    },
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      Auth.ensureSignedOut(req);

      await Joi.validate(args, signUp, { abortEarly: false });

      const user = await User.create(args);

      req.session.userId = user.id;

      return user;
    },
    signIn: async (root, args, { req }, info) => {
      await Joi.validate(args, signIn, { abortEarly: false });

      const user = await attemptSignIn(args.email, args.password);

      req.session.userId = user.id;

      return user;
    },
    signOut: (root, args, { req, res }, info) => {
      return signOut(req, res);
    },
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate("chats").execPopulate()).chats;
    },
  },
};
