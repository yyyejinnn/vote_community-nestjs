import { SignUpUserDto, WhereOption } from '@vote/common';

export interface UsersServiceInterface {
  createUser(dto: SignUpUserDto);
  getAllUsers();
  findUserByWhereOption(whereOption: WhereOption);
  updateProfilePhoto(userId: number, profilePhoto: Express.Multer.File);
  updatePassword(userId: number, password: string);
  deleteUser(userId: number);
}
