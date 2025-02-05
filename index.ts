import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyparser from "koa-bodyparser";
import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";

const app: Koa = new Koa();
const router: Router = new Router();
const films = [{id: 1, name: "ABC"}, {id:2, name: "DEF"}];
const customErrorMessage: CustomErrorMessageFunction = (
    ctx: RouterContext, value: string)=>{
        return('The length must not less than 3 characters, now only ${value.length}')
    };

const validatorName = [
    body("name").isLength({min:3}).withMessage(customErrorMessage).build(),
    body("id").isInt({min: 10000, max:20000}).build()
]

router.get('/', async(ctx: RouterContext, next: any) => {
    ctx.body = {msg: 'Hello World!' };
    await next();
});

router.post('/', async(ctx: RouterContext, next: any)=>{
    const data= ctx.request.body;
    ctx.body = data;
    await next();
});

router.get('/film', async(ctx: RouterContext, next: any)=>{
    ctx.body = films;
    await next();
});

router.post('/film', ...validatorName, async(ctx: RouterContext, next: any)=>{
    /*const data: any = ctx.request.body;
    films.push(data);
    ctx.body = {"code":200};
    await next();*/
    const result = validationResults(ctx);
    if(result.hasErrors()){
        ctx.status = 422;
        ctx.body = {err: result.mapped()}
    } else {
        const data: any = ctx.request.body;
        films.push(data);
        ctx.body = {"code":200};
    }
    await next();
});

router.put('/film', async(ctx: RouterContext, next: any)=>{
    const data: any = ctx.request.body;
    for(let i = 0; i < films.length; i++){
        if(films[i].id == data.id){
            films[i].name = data.name;
        }
        ctx.body = {"code":200};
    }
    await next();
});

app.use(json());
app.use(logger()).use(bodyparser());
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx: RouterContext, next: any)=>{
    try{
        await next();
        if(ctx.status == 404){
            ctx.status = 404;
            ctx.body = { err: "No such endpoint"}
        }
    } catch(err: any){
        ctx.body = {err: err}
    }
})

app.listen(10888, () => {
    console.log("Koa Started");
})