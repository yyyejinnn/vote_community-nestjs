export type ExceptionObj = {
  code: string;
  message: string;
};

export class UsersException {
  static NOT_MATCHED_PASSWORD: ExceptionObj = {
    code: 'NOT_MATCHED_PASSWORD',
    message: '비밀번호가 일치하지 않습니다',
  };

  static NICKNAME_ALREADY_EXISTS: ExceptionObj = {
    code: 'NICKNAME_ALREADY_EXISTS',
    message: '이미 존재하는 닉네임입니다.',
  };

  static USER_ALREADY_EXISTS: ExceptionObj = {
    code: 'USER_ALREADY_EXISTS',
    message: '이미 가입된 이메일입니다.',
  };

  static USER_NOT_EXIST: ExceptionObj = {
    code: 'USER_NOT_EXIST',
    message: '존재하지 않는 사용자입니다.',
  };

  static REFRESH_TOKEN_EXIST: ExceptionObj = {
    code: 'REFRESH_TOKEN_EXIST',
    message: '이미 존재하는 토큰입니다.',
  };

  static TOKEN_NOT_EXISTS: ExceptionObj = {
    code: 'TOKEN_NOT_EXISTS',
    message: '토큰이 없습니다.',
  };

  static EXPIRED_TOKEN: ExceptionObj = {
    code: 'EXPIRED_TOKEN',
    message: '만료된 토큰입니다.',
  };

  static UNVERIFIED_ACCESS_TOKEN: ExceptionObj = {
    code: 'UNVERIFIED_ACCESS_TOKEN',
    message: '유효하지 않은 Access 토큰입니다.',
  };

  static UNVERIFIED_REFRESH_TOKEN: ExceptionObj = {
    code: 'UNVERIFIED_REFRESH_TOKEN',
    message: '유효하지 않은 Refresh 토큰입니다.',
  };

  static SAME_CURR_PASSWORD: ExceptionObj = {
    code: 'SAME_CURR_PASSWORD',
    message: '현재 비밀번호와 동일합니다.',
  };
}

export class VotesException {
  static ALREADY_VOTED: ExceptionObj = {
    code: 'ALREADY_VOTED',
    message: '이미 투표 했습니다.',
  };

  static EMPTY_COMMENT_CONTENT: ExceptionObj = {
    code: 'EMPTY_COMMENT_CONTENT',
    message: '댓글 내용이 없습니다.',
  };

  static END_DATE_LTE_TO_NOW: ExceptionObj = {
    code: 'END_DATE_LTE_TO_NOW',
    message: '투표 종료일이 오늘 날짜와 같거나 작습니다.',
  };
}

export class AwsException {
  static FAILED_UPLOAD_S3: ExceptionObj = {
    code: 'FAILED_UPLOAD_S3',
    message: 's3 파일 업로드에 실패했습니다.'
  }
}

export class OthersException {
  static NOT_VALIDATION_ERROR_CODE: ExceptionObj = {
    code: 'NOT_VALIDATION_ERROR_CODE',
    message: 'error code가 정의되지 않았습니다.',
  };
}
