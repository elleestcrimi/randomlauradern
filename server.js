const compression = require('compression');
const express     = require('express');
const path        = require('path');
const cors        = require('cors');
const app         = express();
const fs          = require('fs');
const _photos_dir = 'photos/';
const port        = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('public'))
app.use(cors({ origin: '*' }));

app.get('/', function(req, res) {
    res.status(200);
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/random.jpg', function(req, res) {
    let photos = getPhotosList();

    if (!photos) {
        res.status(500);
        return;
    } else if (!photos.length) {
        res.status(404);
        return;
    } else {
        res.status(200);
    }

    let randomIndex   = Math.floor(Math.random() * photos.length);
    let randomName    = photos[randomIndex];

    if (!randomName) {
        res.status(500);
        return;
    } else {
        res.status(200);
    }

    res.type('json');
    res.send({ url: `/photos/${randomName}` });
});

app.get('/random', function(req, res) {
    let photos = getPhotosList();

    if (!photos) {
        res.status(500);
        return;
    } else if (!photos.length) {
        res.status(404);
        return;
    } else {
        res.status(200);
    }

    let randomIndex   = Math.floor(Math.random() * photos.length);
    let randomName    = photos[randomIndex];
    let randomContent = getPhotoContent(randomName);

    if (!randomContent || !randomContent.length) {
        res.status(500);
        return;
    } else {
        res.status(200);
    }

    res.type('png');
    res.end(randomContent, 'binary');
});

app.get('/photos/:name', function(req, res) {
    let name          = req.params.name;

    if (!name) {
        res.status(404);
	return;
    }

    let content = getPhotoContent(name);

    if (!content || !content.length) {
        res.status(500);
        return;
    } else {
        res.status(200);
    }

    res.type('png');
    res.end(content, 'binary');
});

function getPhotosList() {
    return fs.readdirSync(_photos_dir);
}

function getPhotoContent(filename) {
    return fs.readFileSync(_photos_dir + filename, 'binary');
}

app.listen(port, function() {
    console.log(`listening to http://localhost:${port}`);
});
