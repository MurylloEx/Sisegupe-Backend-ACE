import { Router, Request, Response } from "express";
import { badRequest, notFound, ok, unauthorized } from "../services/Response.Service";
import { deleteProjectById } from "../services/Project.Service";
import { getProjectById, getProjects } from "../services/Project.Service";
import { saveProject, updateProject } from "../services/Project.Service";
import { isAdmin, parseBearer } from "../../security/Authorize";
import { getUserById } from "../services/User.Service";
import { saveDocument } from "../services/Document.Service";
import { Document } from "../models/Document.Model";
import { Project } from "../models/Project.Model";
import { DocumentType } from "../models/DocumentType.Enum";

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
  try{
    return res.json(ok(await getProjects()));
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.get('/:projectId', async (req: Request, res: Response) => {
  try{
    return res.json(ok(await getProjectById(req.params.projectId)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

router.post('/', async (req: Request, res: Response) => {
  try{
    const { fileLinks, ...body } = req.body;
    console.log(body)
    let jwt = parseBearer(req);

    if (!jwt)
      return res.status(401).json(unauthorized());

    let user = await getUserById(jwt.id);

    if (!user)
      return res.status(401).json(unauthorized());
    
    const newProject = Project.create(<Project>body);
    newProject.author = user;
    const savedProject = await saveProject(newProject);
    let documents: Document[] = [];

    if (!!fileLinks && Array.isArray(fileLinks)){
      for (let k = 0; k < fileLinks.length; k++){ 
        if (!!fileLinks[k].fileLink){ 
          let currentDocument = Document.create({ 
            fileName: fileLinks[k].fileLink, 
            type: DocumentType.Link 
          });
          currentDocument.project = savedProject;
          documents.push(await saveDocument(currentDocument));
        }
      }
      newProject.fileDocuments = documents;
    }

    return res.json(ok(savedProject));
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.put('/:projectId', async (req: Request, res: Response) => {
  try{
    const project = await getProjectById(req.params.projectId);
    if (!!project){
      let jwt = parseBearer(req);
      if ((jwt.id != project.author?.id) && !isAdmin(req)){
        return res.status(404).json(notFound());
      }
      const newProject = await updateProject(project, req.body);
      return res.json(ok(await saveProject(newProject)));
    } else {
      return res.status(404).json(notFound());
    }
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.delete('/:projectId', async (req: Request, res: Response) => {
  try{
    const project = await getProjectById(req.params.projectId);
    if (!!project){
      let jwt = parseBearer(req);
      if ((jwt.id != project.author?.id) && !isAdmin(req)){
        return res.status(404).json(notFound());
      }
    }
    return res.json(ok(await deleteProjectById(req.params.projectId)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

export default router;
