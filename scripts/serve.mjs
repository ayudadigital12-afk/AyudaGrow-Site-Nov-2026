import http from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const redirects=new Map(readFileSync(resolve(root,'_redirects'),'utf8').split('\n').filter(Boolean).map(line=>line.trim().split(/\s+/)).map(([from,to,code])=>[from,{to,code:Number(code)}]));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const server=http.createServer((req,res)=>{
 res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
 try {
  const u=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(u.pathname);
  if(redirects.has(pathname)){const r=redirects.get(pathname);res.writeHead(r.code,{Location:r.to+u.search});return res.end();}
  let file=resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end();}
  try{if(statSync(file).isDirectory())file=resolve(file,'index.html');if(!statSync(file).isFile())throw Error();}catch{res.statusCode=404;file=resolve(root,'404.html');}
  const bytes=readFileSync(file);res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.setHeader('Content-Length',bytes.length);res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(400);res.end('Bad request');}
});
const port=Number(process.env.PORT||4173);const host=process.env.HOST||'127.0.0.1';
server.listen(port,host,()=>console.log(`AyudaGrow local preview: http://${host}:${port}/ (indexing disabled)`));
