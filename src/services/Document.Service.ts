import { getRepository } from "typeorm";
import { Document } from "../models/Document.Model";


export async function getDocuments(){
  return await getRepository(Document).find();
}

export async function getDocumentById(id: string){
  return await getRepository(Document).findOne({
    relations: ['project', 'project.author'],
    where: {id}
  });
}

export async function createDocument(document: any){
  return getRepository(Document).create(document);
}

export async function saveDocument(document: Document){
  return await getRepository(Document).save(document);
}

export async function updateDocument(document: Document, updatedDocument: Document){
  return getRepository(Document).merge(document, updatedDocument);
}

export async function deleteDocumentById(id: string){
  return await getRepository(Document).delete({id});
}

export async function changeDocumentById(id: string, updatedDocument: Document){
  return await getRepository(Document).update(id, updatedDocument);
}