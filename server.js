import http from 'http';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import dotenv from 'dotenv';
import { newDataId } from './lib/functions.js';


// environment init
dotenv.config();
let PORT = process.env.SERVER_PORT;


// data management
let students_json = readFileSync('./data/students.json');
let students_obj = JSON.parse(readFileSync('./data/students.json'));


http.createServer((req, res) => {

    // url management
    if(req.url === '/api/students' && req.method === 'GET'){
        // all data show
        res.writeHead(200, { 'Content-type' : 'application/json' });
        res.end(students_json);
    }else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'GET'){
        // single data show
        let id = req.url.split('/')[3];
        if(students_obj.some(data => data.id == id)){
            
            let data = students_obj.find(data => data.id == id);
            res.writeHead(200, { 'Content-type' : 'application/json' });
            res.end(JSON.stringify(data));

        }else{
            res.writeHead(200, { 'Content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student Not Found"
            }));
        }


    }else if(req.url === '/api/students' && req.method === 'POST'){

        // new data add 
        let data = '';
        req.on('data', (chunk) => {
            
            data += chunk.toString();

        });
        req.on('end', () => {

            let { name , skill, location} = JSON.parse(data);
           
            students_obj.push({
                id : newDataId(students_obj), 
                name : name,
                skill : skill,
                location : location
            });

            writeFileSync('./data/students.json', JSON.stringify(students_obj));

            res.writeHead(200, { 'Content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "New Student Added Successfully"
            }));

        });

    }else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'DELETE'){

        let delId = req.url.split('/')[3]
        if(students_obj.some(data => data.id == delId)){
            let delStu = students_obj.filter(data => data.id != delId);
            
            writeFileSync('./data/students.json', JSON.stringify(delStu));
        }

    }else{
        res.writeHead(200, { 'Content-type' : 'application/json' });
        res.end(JSON.stringify({
            "error" : "Data Not Found"
        }));
    }



}).listen(PORT, () => {
    console.log('server is running ...');
})


