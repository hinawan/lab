//import { describe, test, it } from "node:test";
import { config } from "../config";

const correct = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    connection_limit: 100
}

describe('Demo on testing', ()=>{
    test('Test to see if the config return correct value',()=>{
    expect(config).toEqual(correct)
    })
})