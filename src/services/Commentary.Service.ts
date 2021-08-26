import { getRepository } from "typeorm";
import { Commentary } from "../models/Commentary.Model";


export async function getCommentaryById(id: string){
  return await getRepository(Commentary).findOne({
    relations: ['author'],
    where: {id}
  });
}

export async function createCommentary(commentary: Commentary){
  return getRepository(Commentary).create(commentary);
}

export async function saveCommentary(commentary: Commentary){
  return await getRepository(Commentary).save(commentary);
}

export async function deleteCommentaryById(id: string){
  return await getRepository(Commentary).delete({id});
}
