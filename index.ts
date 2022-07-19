import express from 'express'
// require('dotenv').config()
import cors from 'cors'
import { services } from './src/services/index'
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.use(morgan('dev', {
    skip: function (req: any, res: any) { return res.statusCode < 400 }
  }))
  app.use(morgan('dev', {
    skip: function (req: any, res: any) { return res.statusCode >= 400 }
  }))
// Middlewares

app.use('/api', services);

const port = 8000;

app.listen(port, () =>
    console.log(`Express app listening on localhost:${port}`)
);
