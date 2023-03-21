import {
  AfterInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonEntity } from './base.entity';
import { CommentsEntity } from './comments.entity';
import {
  ChoicedUsersEntity,
  VotedUsersEntity,
  VotesEntity,
} from './votes.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => VotesEntity, (writtenVotes) => writtenVotes.writer)
  writtenVotes?: VotesEntity[];

  @OneToMany((type) => VotedUsersEntity, (votedUsers) => votedUsers.user, {
    onDelete: 'CASCADE',
  })
  votedUsers?: VotedUsersEntity[];

  @OneToMany((type) => ChoicedUsersEntity, (choicedUser) => choicedUser.user, {
    onDelete: 'CASCADE',
  })
  choicedUsers?: ChoicedUsersEntity[];

  @ManyToMany((type) => VotesEntity, (likedVotes) => likedVotes.likedUsers)
  likedVotes?: VotesEntity[];

  @OneToMany(
    (type) => CommentsEntity,
    (writtenComments) => writtenComments.writer,
  )
  writtenComments?: CommentsEntity[];

  @ManyToMany(
    (type) => CommentsEntity,
    (likedComments) => likedComments.likedUsers,
  )
  likedComments?: CommentsEntity[];

  // @AfterInsert()
  // async createRefreshToken() {
  //   const refreshToken = new RefreshTokensEntity();
  //   refreshToken.user = this;
  //   refreshToken.save();
  // }

  static async toEntity(
    email?: string,
    nickname?: string,
    password?: string,
    photo?: string,
    id?: number,
  ) {
    const user = new UsersEntity();
    if (email) user.email = email;
    if (nickname) user.nickname = nickname;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (photo) user.photo = photo;
    if (id) user.id = id;

    return user;
  }
}
