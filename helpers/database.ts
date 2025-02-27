import { Sequelize, QueryTypes } from 'sequelize';
import { config } from '../config';
// define an async utility function to get a connection
// run an SQL query then end the connection
export const run_query = async (query: any, values: any) => {
    try {
        const sequelize = new Sequelize(`postgres://${config.user}:${
       config.password}@${config.host}:${config.port}/${config.database}`);
        await sequelize.authenticate();
        let data = await sequelize.query(query, {
        replacements: values,
        type: QueryTypes.SELECT
        });
        await sequelize.close();
        return data;
        } catch (err: any) {
        console.error(err, query, values);
        throw 'Database query error';
        }
       }
       export const run_insert = async function run_insert(sql: string, values: any) {
        try {
            const sequelize = new Sequelize(`postgres://${ config.user}:${
            config.password}@${config.host}:${config.port}/${ config.database}`);
            await sequelize.authenticate();
            let data = await sequelize.query(sql, {
            replacements: values,
            type: QueryTypes.INSERT
            });
            await sequelize.close();
            return data;
        } catch (err: any) {
            console.error(err, sql, values);
            throw 'Database query error';
        }
       }
       

       export const run_delete = async (table: string, key: string, value: any) => {
        try {
            const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
            await sequelize.authenticate();
            const sql = `Delete form ${table} where ${key} = ${value}`
            let data = await sequelize.query(sql, {type: QueryTypes.DELETE });
            await sequelize.close();
            return data;
        } catch(err: any){
            console.error(err);
            throw 'Database delete error';
        }
       }