import { User } from './User.Model';
import { Project } from './Project.Model';
import { IsDefined, MaxLength } from 'class-validator';
import { MinLength, validateOrReject } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ManyToOne } from 'typeorm';

@Entity()
export class Commentary extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @IsDefined()
  @MaxLength(512)
  @MinLength(8)
  @Column()
  public text?: string;

  @ManyToOne(type => User, user => user.commentaries)
  public author?: User;

  @ManyToOne(type => Project, project => project.commentaries, { onDelete: 'CASCADE' })
  public project?: Project;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

}