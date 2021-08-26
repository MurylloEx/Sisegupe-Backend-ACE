import { encrypt, decrypt } from "./RC4";

export function build(data: any){
  try{
    return Buffer.from(
      <string>encrypt(encodeURIComponent(
        JSON.stringify(data)))).toString('base64');
  } catch (e){
    return "";
  }
}

export function parse(bearer: string){
  try{
    return JSON.parse(
      decodeURIComponent(<string>decrypt(
        Buffer.from(bearer, 'base64').toString())));
  } catch(e){
    return false;
  }
}
