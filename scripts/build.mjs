import {readFile,writeFile} from 'node:fs/promises';
const origin=process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:null) || (process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:null);
if(origin){
 const target=new URL(origin);if(!['http:','https:'].includes(target.protocol))throw new Error('SITE_URL inválida');
 for(const file of ['dist/index.html','dist/robots.txt','dist/sitemap.xml']){
  const text=await readFile(file,'utf8');
  await writeFile(file,text.replaceAll('https://caes-cia-caji.dalton-cidreira7.chatgpt.site',target.origin));
 }
}
console.log('Site estático preparado.');
