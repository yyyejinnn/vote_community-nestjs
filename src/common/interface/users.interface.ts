export type JwtPayload = {
  sub: number;
  nickname: string;
};

export type VerifiedToken = JwtPayload & {
  iat: number;
  exp: number;
};

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
