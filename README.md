# get-paid

## local be

### pre-reqs:

 * docker client

### installation:

 * `run-local-be` will start up the docker container
 * you can then browse to the dynamodb shell here: `http://localhost:8000/shell/`
 * or you can interact with the dynamodb with the awscli like: `aws dynamodb <command> --endpoint-url http://localhost:8000`

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
