import RC4Class from 'rc4-ts';

const SecretKey = '32fa9a12-ccf9-4e70-968c-f6559c9ad405';
const RC4Provider = new RC4Class(SecretKey);

export function encrypt(data: string){
  return RC4Provider.encrypt(data);
}

export function decrypt(data: string){
  return RC4Provider.decrypt(data);
}