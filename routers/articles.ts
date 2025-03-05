import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { basicAuth } from '../controllers/auth'
import * as articlesmodel from '../models/articles';
import {validateArticle} from '../controllers/validation';


const router = new Router({prefix: '/api/v1/articles'});

interface Article {
    title: string,
    alltext: string
}

const getAll = async (ctx:RouterContext, next: any) => {
    
    let articles = await articlesmodel.getAll();
    if(articles.length){
        ctx.body = articles;
    } else {
        ctx.body = {}
    }
    await next();
}

const getById = async (ctx:RouterContext, next: any) => {
    let id = ctx.params.id;
    let article = await articlesmodel.getById(id);
    if(article.length){
        ctx.body = article[0];
    } else {
        ctx.status = 404;
    }
    await next();
}
const createArticle = async (ctx:RouterContext, next: any) => {
    const body = <Article> ctx.request.body;
    let result = await articlesmodel.add(body);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = body;
    } else {
        ctx.status = 500;
        ctx.body = { err: "Insert data failed"};
    }
    await next();
}
const updateArticle = async (ctx:RouterContext, next: any) => {
    const body = <Article> ctx.request.body;
    let result = await articlesmodel.update(parseInt(ctx.params.id), body);
    switch(result.status){
        case 201:
            ctx.status = 201;
            ctx.body = { description: 'Data update succesfully'};
            break;
        case 404:
            ctx.status = 404;
            ctx.body = { description: 'ID not found and no data updated'};
            break;
        default:
            ctx.status = 500;
            ctx.body = { err: "Update data failed"};
            break;
    }
    await next();
}
const deleteArticle = async (ctx:RouterContext, next: any) => {
    await articlesmodel.deleteArticle(parseInt(ctx.params.id));
    ctx.status = 200;
    ctx.body = {status: 'operation successfully'}
    await next();
}

router.get('/', getAll);
router.get('/:id([0-9]{1,})', basicAuth, getById);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle, updateArticle);
router.delete('/:id([0-9]{1,})', basicAuth, deleteArticle);

export { router };
