import { SignUpUserDto } from '@vote/common';

export interface UsersServiceInterface {
  createUser(dto: SignUpUserDto);
  getAllUsers();
  getUserProfile(userId: number);
  updateProfilePhoto(userId: number, profilePhoto: Express.Multer.File);
  updatePassword(userId: number, password: string);
  deleteUser(userId: number);
}
