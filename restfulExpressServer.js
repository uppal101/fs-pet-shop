'use strict'

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8000));


app.disable('x-powered-by');

var morgan = require('morgan');
app.use(morgan('short'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    res.send(pets[id]);
  })
});

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);

    res.send(pets);
  })
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);
    // var pet = req.body.name
    var pet = {name :req.body.name,
      age: req.body.age,
      kind: req.body.kind };
      // console.log(req.body);

    if (!req.body.name || !req.body.age || !req.body.kind) {
      return res.sendStatus(400);
    }

    pets.push(pet);

    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }
      res.send(pet);
    });
  });
});

app.patch('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    if (!req.body.name && !req.body.age && !req.body.kind) {
      return res.sendStatus(400);
    } else {
      var pets = JSON.parse(petsJSON);
      var pet = { name: req.body.name || pets[req.params.id].name,
        age: req.body.age || pets[req.params.id].age,
        kind: req.body.kind || pets[req.params.id].kind};
    }
    pets[req.params.id] = pet;
    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }
      res.send(pet)
    })
  });
});

app.delete('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(petsJSON);
    var id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= pets.length) {
      return res.sendStatus(404);
    }

    var pet = pets.splice(id, 1)[0];
    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      // var pet = pets.splice(id, 1)[0];
      res.set('Content-Type', 'application/json')
      res.send(pet);
    });
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('Listening on ' + port);
});

module.exports = app;
