
function buildResponse(status: number, data?: any){
  return {
    timestamp: +new Date,
    status,
    data
  }
}

export function ok(data?: any){
  return buildResponse(200, data);
}

export function notFound(data?: any){
  return buildResponse(404, data);
}

export function badRequest(data?: any){
  return buildResponse(400, data);
}

export function unauthorized(data?: any){
  return buildResponse(401, data);
}
