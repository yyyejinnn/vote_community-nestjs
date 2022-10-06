export type ExceptionObj = {
  code: string;
  message: string;
};

export class UsersException {
  static NOT_MATCHED_PASSWORD: ExceptionObj = {
    code: '00001',
    message: '비밀번호가 일치하지 않습니다',
  };

  static NICKNAME_ALREADY_EXISTS: ExceptionObj = {
    code: '00002',
    message: '이미 존재하는 닉네임입니다.',
  };

  static USER_ALREADY_EXISTS: ExceptionObj = {
    code: '00003',
    message: '이미 가입된 이메일입니다.',
  };

  static USER_NOT_EXIST: ExceptionObj = {
    code: '00003',
    message: '존재하지 않는 사용자입니다.',
  };

  static REFRESH_TOKEN_EXIST: ExceptionObj = {
    code: '00004',
    message: '이미 존재하는 토큰입니다.',
  };

  static TOKEN_NOT_EXISTS: ExceptionObj = {
    code: '00000',
    message: '토큰이 없습니다.',
  };

  static EXPIRED_TOKEN: ExceptionObj = {
    code: '00000',
    message: '만료된 토큰입니다.',
  };

  static UNVERIFIED_TOKEN: ExceptionObj = {
    code: '00000',
    message: '유효하지 않은 토큰입니다.',
  };
}
