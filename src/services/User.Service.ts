import { getRepository } from "typeorm";
import { User } from "../models/User.Model";

export async function getUsers(){
  return await getRepository(User).find();
}

export async function getUserById(id: string){
  return await getRepository(User).findOne({id});
}

export async function getUserByEmail(email: string){
  return await getRepository(User).findOne({email});
}

export async function createUser(user: User){
  return getRepository(User).create(user);
}

export async function saveUser(user: User){
  return await getRepository(User).save(user);
}

export async function updateUser(user: User, updatedUser: User){
  return getRepository(User).merge(user, updatedUser);
}

export async function deleteUserById(id: string){
  return await getRepository(User).delete({id});
}
