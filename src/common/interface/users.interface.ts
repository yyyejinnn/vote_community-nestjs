type JwtPayload = {
  sub: number;
  nickname: string;
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
