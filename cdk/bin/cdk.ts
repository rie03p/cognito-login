#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib/core';
import { AuthStack } from '../lib/auth-stack';

const app = new cdk.App();
new AuthStack(app, 'AuthStack', {
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackUrls: (process.env.CALLBACK_URLS || '').split(','),
  logoutUrls: (process.env.LOGOUT_URLS || '').split(','),
  domainPrefix: process.env.DOMAIN_PREFIX!,
});
