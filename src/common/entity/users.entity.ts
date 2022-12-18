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
import {
  ChoicedUsersEntity,
  VoteChoicesEntity,
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
  refreshToken: RefreshTokensEntity;

  @OneToMany(() => VotesEntity, (writtenVotes) => writtenVotes.writer)
  writtenVotes: VotesEntity[];

  @OneToMany(() => VotedUsersEntity, (votedUsers) => votedUsers.user, {
    onDelete: 'CASCADE',
  })
  votedUsers: VotedUsersEntity[];

  @OneToMany(() => ChoicedUsersEntity, (choicedUser) => choicedUser.user, {
    onDelete: 'CASCADE',
  })
  choicedUsers: ChoicedUsersEntity[];

  @ManyToMany(() => VotesEntity, (likedVotes) => likedVotes.likedUsers)
  likedVotes: VotesEntity[];

  @AfterInsert()
  async createRefreshToken() {
    const refreshToken = new RefreshTokensEntity();
    refreshToken.user = this;
    refreshToken.save();
  }
}
