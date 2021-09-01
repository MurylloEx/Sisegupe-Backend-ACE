import { Router, Request, Response } from "express";
import { badRequest, notFound, ok, unauthorized } from "../services/Response.Service";
import { getProjectById } from "../services/Project.Service";
import { deleteCommentaryById, getCommentaryById, saveCommentary } from "../services/Commentary.Service";
import { isAdmin, parseBearer } from "../../security/Authorize";
import { Commentary } from "../models/Commentary.Model";
import { getUserById } from "../services/User.Service";

const router = Router();

router.get('/:projectId', async (req: Request, res: Response) => {
  try{
    let project = await getProjectById(req.params.projectId);
    if (!project)
      return res.status(404).json(notFound());
    return res.json(ok(project.commentaries));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

router.post('/:projectId', async (req: Request, res: Response) => {
  try{
    let jwt = parseBearer(req);
    if (!jwt && !isAdmin(req))
      return res.status(401).json(unauthorized());
    let project = await getProjectById(req.params.projectId);
    if (!project)
      return res.status(404).json(notFound());
    let newCommentary = Commentary.create(<Commentary>req.body);
    newCommentary.author = await getUserById(jwt.id);
    newCommentary.project = project;
    return res.json(ok(await saveCommentary(newCommentary)));
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/:commentaryId/delete', async (req: Request, res: Response) => {
  try{
    let commentary = await getCommentaryById(req.params.commentaryId);
    if (!commentary)
      return res.status(404).json(notFound());
    let jwt = parseBearer(req);
    if ((jwt.id != commentary.author?.id) && !isAdmin(req))
      return res.status(401).json(unauthorized());
    await deleteCommentaryById(<string>commentary?.id);
    return res.json(ok(commentary));
  } catch(e){
    return res.status(400).json(badRequest());
  }
});

export default router;
