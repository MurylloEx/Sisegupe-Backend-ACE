import sha256 from "sha256";
import { Router, Request, Response } from "express";
import { build } from "../../security/Jwt";
import { badRequest, ok } from "../services/Response.Service";
import { createUser } from "../services/User.Service";
import { getUserByEmail } from "../services/User.Service";
import { saveUser } from "../services/User.Service";

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try{
    const { email, password } = req.body;
    let user = await getUserByEmail(email);
    if (user?.password != sha256(password)){
      return res.status(401).json();
    }
    user.password = password;
    return res.status(200).json(ok(
      {
        token: build({
          id: user.id,
          role: user.role,
          email: user.email
        }),
        data: user
      }));
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try{
    let newUser = await createUser(req.body);
    if (!!(await getUserByEmail(<string>newUser.email)))
      throw new Error('Usuário já existe no sistema. Tente um e-mail diferente.');
    newUser.password = sha256(<string>newUser.password);
    newUser.role = 1;
    newUser = await saveUser(newUser);
    return res.status(200).json(ok(newUser));
  } catch(e){
    return res.status(400).json(badRequest(e));
  }
});

export default router;
