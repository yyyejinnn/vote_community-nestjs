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
    code: '00004',
    message: '존재하지 않는 사용자입니다.',
  };

  static REFRESH_TOKEN_EXIST: ExceptionObj = {
    code: '00005',
    message: '이미 존재하는 토큰입니다.',
  };

  static TOKEN_NOT_EXISTS: ExceptionObj = {
    code: '00006',
    message: '토큰이 없습니다.',
  };

  static EXPIRED_TOKEN: ExceptionObj = {
    code: '00007',
    message: '만료된 토큰입니다.',
  };

  static UNVERIFIED_ACCESS_TOKEN: ExceptionObj = {
    code: '00008',
    message: '유효하지 않은 Access 토큰입니다.',
  };

  static UNVERIFIED_REFRESH_TOKEN: ExceptionObj = {
    code: '00009',
    message: '유효하지 않은 Refresh 토큰입니다.',
  };
}

export class VotesException {
  static ALREADY_VOTED: ExceptionObj = {
    code: '10001',
    message: '이미 투표 했습니다.',
  };

  static EMPTY_COMMENT_CONTENT: ExceptionObj = {
    code: '10002',
    message: '댓글 내용이 없습니다.',
  };

  static END_DATE_LTE_TO_NOW: ExceptionObj = {
    code: '10003',
    message: '투표 종료일이 오늘 날짜와 같거나 작습니다.',
  };
}
