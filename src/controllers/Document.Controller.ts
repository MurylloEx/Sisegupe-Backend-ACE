import { join } from "path";
import { Router, Request, Response } from "express";
import { badRequest, notFound, ok, unauthorized } from "../services/Response.Service";
import { deleteDocumentById, getDocumentById, saveDocument } from "../services/Document.Service";
import { Document } from "../models/Document.Model";
import { getProjectById } from "../services/Project.Service";
import { Project } from "../models/Project.Model";
import { parseBearer } from "../../security/Authorize";
import { DocumentType } from "../models/DocumentType.Enum";

const router = Router();

router.get('/:fileGuid', async (req: Request, res: Response) => {
  try{
    let document = await getDocumentById(req.params.fileGuid);
    if (!!document){
      if (document.type == DocumentType.File){
        let filePath = join(__dirname, '../../docs/', <string>document?.id);
        return res.sendFile(filePath, (err) => {
          if (!!err)
            return res.status(404).json(notFound());
        });
      } else {
        return res.status(200).json(ok(document));
      }
    }
    return res.status(404).json(notFound());
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/project/:projectId', async (req: Request, res: Response) => {
  try{
    if (!req.files || Object.keys(req.files).length === 0){
      return res.status(400).json(badRequest());
    }
    let projectId = req.params.projectId;
    let file: any = req.files.upload;
    let project = <Project>await getProjectById(projectId);
    
    if (!project){
      return res.status(404).json(notFound());
    }
    let newDocument = Document.create({ fileName: file.name, project: project, type: DocumentType.File });
    newDocument = await saveDocument(<Document>newDocument);
    file.mv(join(__dirname, '../../docs/', <string>newDocument.id), async (err: any) => {
      if (err)
        return res.status(400).json(badRequest());
      return res.json(ok(newDocument));
    });
  }catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/project/:projectId/link', async (req: Request, res: Response) => {
  try{
    const { fileLink } = req.body;
    let projectId = req.params.projectId;
    let project = <Project>await getProjectById(projectId);
    
    if (!project){
      return res.status(404).json(notFound());
    }

    let newDocument = Document.create({ fileName: fileLink, project: project, type: DocumentType.Link });
    return res.json(ok(await saveDocument(<Document>newDocument)));
  }catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/:fileGuid/delete', async (req: Request, res: Response) => {
  try{
    let document = await getDocumentById(req.params.fileGuid);
    let jwt = parseBearer(req);
    console.log(jwt, document?.project)
    if (!document){
      return res.status(404).json(notFound());
    }
    if (jwt.id != document?.project?.author?.id){
      return res.status(401).json(unauthorized());
    }

    return res.json(ok(await deleteDocumentById(<string>document.id)));
  }catch(e){
    return res.status(400).json(badRequest(e));
  }
});

export default router;
