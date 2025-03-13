import * as db from '../helpers/database';

export const getById = async (id: any) => {
    let query = 'Select * From articles where ID = ?';
    let value = [id];
    let data = await db.run_query(query, value);
    return data;
}

export const getAll = async()=> {
    let query = 'Select * from articles';
    let data = await db.run_query(query, null);
    return data;
}

export const add = async(article: any) => {
    let keys = Object.keys(article);
    let values = Object.values(article);
    let key = keys.join(',');
    let param = '';
    for (let i: number = 0; i < values.length; i++) { param += '?,'}
    param = param.slice(0,-1);
    let query = `Insert into articles (${key}) values (${param})`;
    try {
        await db.run_insert(query, values);
        return {status: 201};
    } catch (err: any) {
        return err;
    }
}

export const update = async(id: number, article: any) => {
    let keys = Object.keys(article);
    let values = Object.values(article);
    let sql = 'UPDATE articles set ';
    for (let i: number = 0; i < keys.length; i++) { 
        // Update Table_name SET col1 = val1, col2 = val2, ... where condition
        sql += `${keys[i]} = ?,`
    }
    sql = sql.slice(0,-1);
    sql+= ` where id = ${id}`
    try {
        const status = await db.run_update(sql, values);
        if(status[1] == 1)  // Return 1 if the ID found, else 404
            return {status: 201};
        else
            return {status: 404};
    } catch (err: any) {
        return err;
    }
}

export const deleteArticle = async(id: number) => {
    try {
        await db.run_delete('articles', 'id', id);
        return
    } catch (err: any) {
        return err;
    }
}


