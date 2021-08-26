import { Router, Request, Response } from "express";
import { badRequest, notFound, ok, unauthorized } from "../services/Response.Service";
import { createProject, deleteProjectById } from "../services/Project.Service";
import { getProjectById, getProjects } from "../services/Project.Service";
import { saveProject, updateProject } from "../services/Project.Service";
import { isAdmin, parseBearer } from "../../security/Authorize";
import { getUserById } from "../services/User.Service";

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
    let jwt = parseBearer(req);
    if (!jwt)
      return res.status(401).json(unauthorized());
    const newProject = await createProject(req.body);
    let user = await getUserById(jwt.id);
    if (!!user){
      newProject.author = user;
    } else {
      return res.status(401).json(unauthorized());
    }
    return res.json(ok(await saveProject(newProject)));
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
