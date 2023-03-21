export interface UsersServiceInterface {
  getAllUsers();
  getUserProfile(userId: number);
  updateProfilePhoto(userId: number, profilePhoto: Express.Multer.File);
  updatePassword(userId: number, password: string);
  deleteUser(userId: number);
}
