import { parse } from "../security/Jwt";

export function parseBearer(req: any){
  try{
    let bearer = req.headers.authorization || "";
    return parse(bearer.replace("Bearer ", ""));
  } catch (e){
    return false;
  }
}

export function isAdmin(req: any){
  try{
    return (parseBearer(req).role == 2);
  } catch (e){
    return false;
  }
}