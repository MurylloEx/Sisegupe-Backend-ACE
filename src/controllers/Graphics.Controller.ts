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

router.get('/courses', async (req: Request, res: Response) => {
  try {
    const { coursesNames } = req.body;
    if (!coursesNames || !Array.isArray(coursesNames))
      return res.status(400).json(badRequest());
    return res.status(200).json(ok(await getProjectsChart(coursesNames)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});


export default router;
