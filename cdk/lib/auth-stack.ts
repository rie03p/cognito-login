import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface AuthStackProps extends cdk.StackProps {
  googleClientId: string;
  googleClientSecret: string;
  callbackUrls: string[];
  logoutUrls: string[];
  domainPrefix: string;
}

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const {
      googleClientId,
      googleClientSecret,
      callbackUrls,
      logoutUrls,
      domainPrefix,
    } = props;

    // User Pool
    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      autoVerify: {
        email: true,
      },
    });

    // Google Identity Provider
    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      "GoogleProvider",
      {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        userPool,
        scopes: ["openid", "email", "profile"],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        },
      }
    );

    // App Client (Hosted UI)
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls,
        logoutUrls,
      },
    });


    // Domain 設定（"<prefix>.auth.ap-northeast-1.amazoncognito.com"）
    const domain = userPool.addDomain("CognitoDomain", {
      cognitoDomain: {
        domainPrefix,
      },
    });

    // App Client に Google Provider をアタッチ
    userPoolClient.node.addDependency(googleProvider);

    // 出力
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "HostedUIDomain", {
      value: domain.baseUrl(),
    });

    new cdk.CfnOutput(this, "GoogleLoginUrl", {
      value: `${domain.baseUrl()}/oauth2/authorize?identity_provider=Google&response_type=code&client_id=${userPoolClient.userPoolClientId}&redirect_uri=${callbackUrls[0]}&scope=openid+email+profile`,
    });
  }
}
