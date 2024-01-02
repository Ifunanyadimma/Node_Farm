const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify'); //--> this is used to create a slug for the product name
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////
///////FILES

// const hello = 'Hello World';
// console.log(hello);

// // Blocking, Synchronous way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// //@ textIn, u write sth about the topic, and then @ date.now, write the date you wrote it

// const textOut = `This is what we know about the Avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut); 
// console.log('File written!');


// // Non-blocking, Asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     // if (err) return console.log('ERROR! 💥')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}'\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!')
//             })
//         })
//     })
// })
// console.log('Will read file!'); --> to check if the file is working



//////////////////////////////
///////SERVER

// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENT%}/g, product.nutrient);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// } --> this is the original code, used to test if the replaceTemplate is working. After which u can comment it out and paste it in modules.js, then export it and use the code below

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugify('Fresh Avacados', {lower: true})); //--> this is used to create a slug for the product name
console.log(slugs);

const server = http.createServer((req, res) => {
    // console.log(req); --> to check if the server is working
    // console.log(req.url); //--> to check if the url is working
    // console.log(url.parse(req.url, true)); --> to check if the url is working
    const { query, pathname } = url.parse(req.url, true);
    // const pathname = req.url; 

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // console.log(cardHtml); use this to check if the cardHtml is working, after which u can comment it out
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

        // res.end(tempOverview); this is the original code, used to test if the overview page is working

        //Product page
    } else if (pathname === '/product') {
        // console.log(query); --> to check if the query is working
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        // res.end('This is the PRODUCT'); -->used to check if the product page is working, after which u can comment it out

        //API
    } else if (pathname === '/api') {

        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
        //     // console.log(productData); -->used to check if the productData is working, after which u can comment it out
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        //Not found
    } else {
        res.writeHead(404, {
            'Content-tyoe': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');

    }
    // res.end('Hello from the server!'); -->to check if the server is working
});

server.listen(3100, '127.0.0.1', () => {
    console.log('Listening to request on port 3100');
})
