import { CommentsService } from 'src/app/votes/votes.service';
import {
  AfterInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RefreshTokensEntity } from './auth.entity';
import { CommonEntity } from './base.entity';
import { CommentsEntity } from './comments.entity';
import {
  ChoicedUsersEntity,
  VotedUsersEntity,
  VotesEntity,
} from './votes.entity';

@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @OneToOne(() => RefreshTokensEntity, (refreshToken) => refreshToken.user)
  refreshToken?: RefreshTokensEntity;

  @OneToMany(() => VotesEntity, (writtenVotes) => writtenVotes.writer)
  writtenVotes?: VotesEntity[];

  @OneToMany(() => VotedUsersEntity, (votedUsers) => votedUsers.user, {
    onDelete: 'CASCADE',
  })
  votedUsers?: VotedUsersEntity[];

  @OneToMany(() => ChoicedUsersEntity, (choicedUser) => choicedUser.user, {
    onDelete: 'CASCADE',
  })
  choicedUsers?: ChoicedUsersEntity[];

  @ManyToMany(() => VotesEntity, (likedVotes) => likedVotes.likedUsers)
  likedVotes?: VotesEntity[];

  @OneToMany(() => CommentsEntity, (writtenComments) => writtenComments.writer)
  writtenComments?: CommentsEntity[];

  @ManyToMany(() => CommentsEntity, (likedComments) => likedComments.likedUsers)
  likedComments?: CommentsEntity[];

  @AfterInsert()
  async createRefreshToken() {
    const refreshToken = new RefreshTokensEntity();
    refreshToken.user = this;
    refreshToken.save();
  }

  static from(
    email: string,
    nickname: string,
    password: string,
    createdAt = new Date(),
    updatedAt = new Date(),
    id?: number,
  ) {
    const user = new UsersEntity();
    user.email = email;
    user.nickname = nickname;
    user.password = password;
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;

    if (id) user.id = id;

    return user;
  }
}
