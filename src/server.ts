import next from 'next';
import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process'
import { join } from 'path'
import fs from 'fs'

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;
    
const dev = process.env.NODE_ENV !== 'production' && !argv.production;
const port = process.env.PORT ?? 8080;
const app = next({ dev })
const handle = app.getRequestHandler()

const setAudioDevice = (device: string) => {
  const exePath = join(__dirname, '../lib/nircmd.exe');
  exec(`${exePath} setdefaultsounddevice "${device}" 1`);
  exec(`${exePath} setdefaultsounddevice "${device}" 2`);
}


app.prepare()
.then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.get('/api/presets', (req, res) => {
    fs.readFile('./presets.json', 'utf8', (err, fd) => {
      if (err) return res.status(400).send(err.message ?? err);

      return res.send(JSON.parse(fd));
    });
  });

  server.post('/api/presets', (req, res) => {
    fs.readFile('./presets.json', 'utf8', (err, fd) => {
      if (err) return res.status(400).send(err.message ?? err);

      const presets: Array<unknown> = JSON.parse(fd);

      const newObj = {...req.body, id: presets.length + 1};
      const newPresets = [...presets, newObj];

      fs.writeFile('./presets.json', JSON.stringify(newPresets), (err) => {
        if (err) return res.status(400).send(err.message ?? err);
        return res.send();
      });
    });

  });

  server.post('/api/presets/toogle/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('./presets.json', 'utf8', (err, fd) => {
      if (err) return res.status(400).send(err.message ?? err);

      const presets: Array<any> = JSON.parse(fd);

      for (const preset of presets) {
        if (preset.id === Number.parseInt(id)) {
          setAudioDevice(preset.speaker);
          setAudioDevice(preset.microphone);
          return res.send();
        }
      }
    });
  });

  server.post('/api/program/exit', (req, res) => {
    res.send();
    process.exit(0)
  });
    
  server.get('*', (req, res) => {
    return handle(req, res)
  })
    
  server.listen(port, () => {
    if (dev) console.log('Running dev build');
    console.log(`> Ready on http://localhost:${port}`);
    exec(`start chrome http://localhost:${port}`);
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
