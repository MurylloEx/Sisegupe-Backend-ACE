import { User } from './User.Model';
import { Document } from './Document.Model';
import { ProjectStage } from './ProjectStage.Enum';
import { IsDefined, MaxLength, MinLength, validateOrReject } from 'class-validator';
import { OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Commentary } from './Commentary.Model';

@Entity()
export class Project extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @IsDefined()
  @MaxLength(64)
  @MinLength(4)
  @Column()
  public title?: string;

  @IsDefined()
  @MaxLength(2048)
  @Column()
  public summary?: string;
  
  @IsDefined()
  @MaxLength(64)
  @MinLength(4)
  @Column()
  public advisorName?: string;

  @IsDefined()
  @MaxLength(32)
  @MinLength(4)
  @Column()
  public courseName?: string;
  
  @IsDefined()
  @Column()
  public projectStage?: ProjectStage;
  
  @ManyToOne(type => User, user => user.projects)
  public author?: User;
  
  @OneToMany(type => Document, document => document.project)
  @JoinColumn()
  public fileDocuments?: Document[];

  @OneToMany(type => Commentary, commentary => commentary.project)
  @JoinColumn()
  public commentaries?: Commentary[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

}