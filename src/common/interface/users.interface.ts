import { Users, VoteComments, Votes } from '@prisma/client';

// type
export type JwtPayload = {
  sub: number;
  nickname: string;
};

export type VerifiedToken = JwtPayload & {
  iat: number;
  exp: number;
};

export type WhereOptionByUserId = {
  id: number;
};

export type WhereOptionByUserEmail = {
  email: string;
};

export type WhereOptionByUserNickName = {
  nickname: string;
};

export type WhereOption =
  | WhereOptionByUserId
  | WhereOptionByUserEmail
  | WhereOptionByUserNickName;

// interface
export interface SignUp {
  users: {
    id: number;
    email: string;
    nickname: string;
    createdAt: Date;
  };
}

export interface SignIn {
  accessToken: string;
  refreshToken: string;
}

export interface RecreateAccessToken {
  accessToken: string;
}

export interface GetUserProfile {
  users: Users;
}

export interface GetUserWrittenVotes {
  votes: Votes[];
}

export interface GetUserWrittenComments {
  comments: VoteComments[];
}
