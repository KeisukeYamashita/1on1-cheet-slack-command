import express, {Request, Response} from 'express';
import Signature from './signature';
import commands, {commandType} from './command';
import dotenv from 'dotenv';
import  bodyParser from 'body-parser'

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ verify: (req, res, buf) => req.rawBody = buf }))

app.post('/cheet', async (req: Request, res: Response) => {
  const {text: args = ''} = req.body;
  const [command, arg] = args.split(' ');

  try {
    await Signature.verify(req);

    if (['help'].includes(command)) {
      const msg = await commands[command as commandType];
      console.log('response successfully')
      return res.json(msg);
    }

    throw new Error(`cannot handle command: ${command}, arg: ${arg}`);
  } catch (err) {
    console.error(err)
    return res.status(500).json({err});
  }
});

app.listen(port, () => {
  console.log('start 1on1 cheet slack command', port);
});
