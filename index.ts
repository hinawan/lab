import Koa from 'koa';
//import Router, { RouterContext } from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import serve from 'koa-static';

import { router as article } from './routers/articles';
import { router as dummy } from './routers/special';

const app: Koa = new Koa();
// const router: Router = new Router();

// const welcomeAPI = async (ctx: RouterContext, next: any) => {
//     ctx.body = {
//         message: "Welcome to THE Blog API!"
//     };
//     await next();
// }

// router.get('/api/v1', welcomeAPI);


app.use(json());
app.use(logger());
//app.use(router.routes()).use(router.allowedMethods());
app.use(article.routes());
app.use(dummy.routes());
app.use(serve('./docs')); // documentation

app.listen(10888, ()=>{
    console.log('Blog API Started');
});