import { Project } from './Project.Model';
import { IsDefined, IsEmail, Max, MaxLength, Min, MinLength, validateOrReject } from 'class-validator';
import { OneToMany, JoinColumn } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Commentary } from './Commentary.Model';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @IsDefined()
  @MaxLength(64)
  @MinLength(4)
  @Column()
  public name?: string;

  @Min(1)
  @Max(2)
  @Column()
  public role?: number = 1;

  @IsDefined()
  @MaxLength(64)
  @MinLength(4)
  @Column()
  public lastname?: string;

  @IsDefined()
  @IsEmail()
  @MaxLength(64)
  @MinLength(4)
  @Column()
  public email?: string;

  @IsDefined()
  @MaxLength(128)
  @MinLength(4)
  @Column()
  public password?: string;

  @OneToMany(() => Project, project => project.author, { cascade: true })
  @JoinColumn()
  public projects?: Project[];

  @OneToMany(() => Commentary, commentary => commentary.author)
  @JoinColumn()
  public commentaries?: Commentary[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

}