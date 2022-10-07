type JwtPayload = {
  sub: number;
  nickname: string;
};

type VerifiedToken = JwtPayload & {
  iat: number;
  exp: number;
};

interface SignUp {
  users: {
    id: number;
    email: string;
    nickname: string;
    createdAt: Date;
  };
}

interface SignIn {
  accessToken: string;
  refreshToken: string;
}

interface RecreateAccessToken {
  accessToken: string;
}
