import * as db from '../helpers/database';
//get a single article by its id
export const getById = async (id: any) => {
    let query = "SELECT * FROM articles WHERE ID = ?"
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
   }
   //list all the articles in the database
   export const getAll = async () => {
    // TODO: use page, limit, order to give pagination
    let query = "SELECT * FROM articles;"
    let data = await db.run_query(query, null);
    return data;
   }
   //create a new article in the database
   export const add = async (article: any) => {
    let keys = Object.keys(article);
    let values = Object.values(article);
    let key = keys.join(',');
    let param = '';
    for(let i: number=0; i<values.length; i++){ param +='?,'}
    param=param.slice(0,-1);
    let query = `INSERT INTO articles (${key}) VALUES (${param})`;
    try{
        await db.run_insert(query, values);
        return {status: 201};
    } catch(err: any) {
        return err;
    }
   }

//    export const update = async(id: number, article: any) => {
//     let keys = Object.keys(article);
//     let values = Object.values(article);
//     let sql = 'UPDATE article set ';
//     for(let i:number = 0; i < keys.length; i++){
//         sql += `${keys[i]} = ?,`
//     }
//     sql = sql.slice(0, -1);
//     sql +=` where id = ${id}`
//     try{
//         const d = await db.run_update(sql, values);
//         console.log(d);
//         return {status: 201};
//     }catch (err: any){
//         return err;
//     }
//    }