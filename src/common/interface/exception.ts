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
    message: '가입되지 않은 이메일입니다.',
  };
}
