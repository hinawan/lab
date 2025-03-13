import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as articlesmodel from '../models/articles';
import { basicAuth } from '../controllers/auth';
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
    let article: any[] = await articlesmodel.getById(id);
    if(article.length){
        // Lab 8 updated: Only delegated user can read the articles: 
        if(ctx.state.user.id == article[0].authorid ) {
            ctx.body = article[0];
        } else {
            ctx.status = 401;
            ctx.body = { msg: 'You are not authorized'};
        }
        // Update completed
    } else {
        ctx.status = 404;
    }
    await next();
}
const createArticle = async (ctx:RouterContext, next: any) => {
    const body = <Article> ctx.request.body;
    // Lab 8 updated: Only delegated user can add the articles
    // Need update the body with the authorid (id) 
    // Note: JSON does not include the authorid
    if(ctx.state.user.id) {
        Object.defineProperty(body, "authorid", { value: ctx.state.user.id, writable: false, enumerable: true, configurable: true });
        let result = await articlesmodel.add(body);
        if(result.status == 201){
            ctx.status = 201;
            ctx.body = body;
        } else {
            ctx.status = 500;
            ctx.body = { err: "Insert data failed"};
        }
    } else {
        ctx.status = 401;
        ctx.body = { msg: 'You are not authorized'};
    }
    await next();
}
const updateArticle = async (ctx:RouterContext, next: any) => {
    // Lab 8 updated: Only delegated user can update the articles: 
    // No action if the user is not correct
    let article: any[] = await articlesmodel.getById(ctx.params.id);
    if(article.length){        
        if(ctx.state.user.id == article[0].authorid ) {
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
        } 
    } else {
        ctx.status = 404;
    }
    await next();
}
const deleteArticle = async (ctx:RouterContext, next: any) => {
    // Lab 8 updated: Only delegated user can update the articles: 
    // No action if the user is not correct
    let article: any[] = await articlesmodel.getById(ctx.params.id);
    if(article.length){ 
        if(ctx.state.user.id == article[0].authorid ) {
            await articlesmodel.deleteArticle(parseInt(ctx.params.id));
            ctx.status = 200;
            ctx.body = {status: 'operation successfully'}
        } else {
            ctx.status = 401;
            ctx.body = { msg: 'You are not authorized'};
        }
    } else {
        ctx.status = 404;
        ctx.body = { msg: 'Article not found'};
    }
    await next();
}

router.get('/', getAll);
router.get('/:id([0-9]{1,})', basicAuth, getById);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle, updateArticle);
router.delete('/:id([0-9]{1,})', basicAuth, deleteArticle);

export { router };
