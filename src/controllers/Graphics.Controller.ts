import { Router, Request, Response } from "express";
import { getProjectsChart, getProjectsInfo } from "../services/Project.Service";
import { badRequest, notFound, ok } from "../services/Response.Service";

const router = Router();

router.get('/projects', async (req: Request, res: Response) => {
  try{
    return res.status(200).json(ok(await getProjectsInfo()));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

router.post('/courses', async (req: Request, res: Response) => {
  try {
    const { courseNames } = req.body;
    if (!courseNames || !Array.isArray(courseNames))
      return res.status(400).json(badRequest());
    return res.status(200).json(ok(await getProjectsChart(courseNames)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});


export default router;
