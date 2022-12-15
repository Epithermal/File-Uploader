const express = require('express');
const app = express();
const port = 80;
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use((req, res, next) => {
    statusCodes = [404, 500, 400, 401, 403, 405, 406, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];
    if (statusCodes.includes(res.statusCode)) {
        errorMessage = `${res.statusCode}`;
        res.render('error', {error: errorMessage});
    }
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
    const maxFileSize = 100000000;
    if (req.file.size > maxFileSize) {
        res.render('error', {error: 'File size is too large'});
        return;
    }
    const file = req.file;
    const id = uuidv4();
    const fileExtension = file.originalname.split('.').pop();
    fs.rename(file.path, `uploads/${id}.${fileExtension}`, (err) => {
        if (err) {
            res.render('error', {error: 'File could not be uploaded'});
            return;
        }
    });
    res.render('success', {id: `${id}.${fileExtension}`});
});

app.get('/download/:id', (req, res) => {
    const file = fs.readFileSync(`uploads/${req.params.id}`);
    res.set('Content-Disposition', `attachment; filename=${req.params.id}`);
    res.send(file);
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

