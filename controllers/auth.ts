import passport from 'koa-passport';
import { BasicStrategy } from 'passport-http';
import { RouterContext } from 'koa-router';

import * as users from '../models/users';

const verifyPassword = (user: any, password: string) => {
    return user.password === password;
}

passport.use(new BasicStrategy(async (username: string, password: string, done) => {
    // ** This is for HARD CODE Test only
    // if(username === 'admin' && password === 'password') {
    //     done(null, {username: 'admin'});
    // } else {
    //     done(null, false);
    // }
    // ** end of hard code
    let result: any[] = [];
    try {
        result = await users.findByUsername(username);
    } catch(error: any) {
        console.error(`Error authentication for user ${username}: ${error}`);
        done(null, false);
    }
    if(result.length) {
        const user = result[0];
        if(verifyPassword(user, password)) {
            done(null, user);
        } else {
            console.log(`Password incorrect for ${username}`);
            done(null, false);
        }
    } else {
        console.log(`${username} is not found`);
        done(null, false);
    }

}));

export const basicAuth = async (ctx: RouterContext, next: any) => {
    await passport.authenticate('basic', { session: false })(ctx, next);
    if(ctx.status == 401){
        ctx.body = {
            msg: 'You are not authorized'
        }
    }else {
        /*ctx.body = {
            msg: 'You are authorized',
            data: ctx.state
        }*/
       return ctx.state
    }
}