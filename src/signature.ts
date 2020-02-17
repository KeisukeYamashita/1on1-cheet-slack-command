import {Request} from 'express';
import crypto from 'crypto';
import timingSafeCompare from 'tsscmp';

const {SLACK_SIGNING_SECRET = ''} = process.env;

export async function verify(req: Request): Promise<true> {
  const body = (req as any).rawBody.toString();

  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);

  if (typeof signature !== 'string') throw new TypeError('Unexpected type of x-slack-signature');
  if (typeof timestamp !== 'string') throw new TypeError('Unexpected type of x-slack-request-timestamp');

  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (Number(timestamp) < fiveMinutesAgo) throw new Error('Slack request signing verification outdated');

  const [version, hash] = signature.split('=');
  hmac.update(`${version}:${timestamp}:${body}`);
  if (!timingSafeCompare(hmac.digest('hex'), hash)) throw new Error('Slack request signing verification failed');

  return true;
}

export default {
  verify,
};
