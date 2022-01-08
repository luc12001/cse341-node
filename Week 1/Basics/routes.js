const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/'){
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>')
        res.write('<body><h1>Hello User click to enter your name.</h1><form action="/users" method="POST"><button type="submit">Enter</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users'){
        res.write('<html>');
        res.write('<head><title>Enter User</title></head>')
        res.write('<body><h1>Hello User, enter you name below</h1><form action="/create-user" method="POST"><input type="text" name="users"><button type="submit">Send</button></form>');
        res.write('<ul><li>user1</li><li>user2></li><ul></body>')
        res.write('</html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const newUser = parsedBody.split('=')[1];
            fs.writeFile('new-user.txt', newUser, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Page Not Found</title></head>')
    res.write('<body><h1>Page not Found! Click Back</h1></body>');
    res.write('</html>');
    res.end();

};

module.exports = {
    handler: requestHandler, 
    someText: 'Some hard coded text'
};