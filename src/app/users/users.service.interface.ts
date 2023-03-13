import { SignUpUserDto, WhereOption } from '@vote/common';

export interface UserServiceInterface {
  createUser(dto: SignUpUserDto);
  getAllUsers();
  findUserByWhereOption(whereOption: WhereOption);
  updateProfilePhoto(userId: number, profilePhoto: Express.Multer.File);
  updatePassword(userId: number, password: string);
  deleteUser(userId: number);
}
