import { AfterInsert, Column, Entity, OneToOne } from 'typeorm';
import { RefreshTokensEntity } from './auth.entity';
import { CommonEntity } from './base.entity';

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

  @AfterInsert()
  async createRefreshToken() {
    const refreshToken = new RefreshTokensEntity();
    refreshToken.user = this;
    refreshToken.save();
  }
}
