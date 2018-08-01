# get-paid

Dynamodb local:

 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
 * `docker run -p 8000:8000 dwmkerr/dynamodb`

## todo

 * test schema sdl file uploaded to s3 (along with cf template)
 * get graphql and dynamodb working locally

 * build expo/react native simple app that uses the graphql api
 * reuse expo work to create a website version (reusing all same code possible?)

 * create a good local development story for the whole piece
 * get branch deployment working (canary deployments)
 * are the templates in the cloudformation s3 bucket shared across branches - potential bleed problem?

## bugs

 * definitions3location was giving a 403 despite it looking like it was public-read to me shrug

## links

 * https://read.acloud.guru/deploy-an-aws-appsync-graphql-api-with-amazon-cloudformation-9a783fdd8491
