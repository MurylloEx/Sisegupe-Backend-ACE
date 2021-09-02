import { Router, Request, Response } from "express";
import { isAdmin, parseBearer } from "../../security/Authorize";
import { changeUserById, getUserById } from "../services/User.Service";
import { deleteUserById } from "../services/User.Service";
import { saveUser, updateUser } from "../services/User.Service";
import { badRequest, notFound, ok, unauthorized } from "../services/Response.Service";
import sha256 from "sha256";

const router = Router();

router.get('/:userId', async (req: Request, res: Response) => {
  try{
    return res.json(ok(await getUserById(req.params.userId)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

router.put('/:userId', async (req: Request, res: Response) => {
  try{
    let jwt = parseBearer(req);
    if (!jwt)
      return res.status(401).json(unauthorized());
    const user = await getUserById(req.params.userId);
    if (!!user){
      if ((user.id != jwt.id) && !isAdmin(req))
        return res.status(401).json(unauthorized());
      const newUser = await updateUser(user, req.body);
      newUser.password = sha256(<string>newUser.password);
      return res.json(ok(await changeUserById(req.params.userId, newUser)));
    } else {
      return res.status(404).json(notFound());
    }
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/:userId/delete', async (req: Request, res: Response) => {
  try{
    if (!isAdmin(req))
      return res.status(401).json(unauthorized());
    return res.json(ok(await deleteUserById(req.params.userId)));
  } catch(e){
    return res.status(404).json(notFound());
  }
});

export default router;
