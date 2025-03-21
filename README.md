# get-paid

eating garbage out of golden plates
  https://news.ycombinator.com/item?id=17854065
  https://news.ycombinator.com/user?id=bumholio

## pre-reqs:

 * yarn
 * aws account
 * docker client
 * virtualbox
 * expo and genymotion
 * run genymotion and start up an android virtual device (TODO: automate this on the cli using gmtool as part of Genymotion 2.5.0 - paid license)
 * `adb reverse tcp:3000 tcp:3000` to open up the localhost 3000 port to the android emulator
 * for lambda local: python 2.7, pip and: `pip install --user aws-sam-cli`
 * postgres (for psql): `brew install postgres`
 * aws ecs cli:
    1. `sudo curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-darwin-amd64-latest`
    2. `sudo chmod +x /usr/local/bin/ecs-cli`
    3. `ecs-cli --version`
    4. `ecs-cli configure profile --profile-name profile_name --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY`

## running locally:

 * `. script/init` will initialise your terminal for the project
 * `local:start:be` will start up dynamodb (and create tables/data) and graphql server
 * `local:start:site` will start up the react website
 * `local:start:mobile` will start up the android app in the emulator

### interacting with local services:

 * browse to dynamodb shell: `http://localhost:8000/shell/`
 * interact with dynamodb with the awscli: `aws dynamodb <command> --endpoint-url http://localhost:8000`
 * browse to graphql: `http://localhost:3000/graphql`
 * browse to the react website: `http://localhost:3001/`
 * interacting with postgres locally: `psql -h localhost -p 5432 -U postgres -W`

 * example graphql query to try:

 ```
  query getTimesheetEntry($id: ID!) {
    timesheetEntry(id: $id) {
      id,
      date
    }
  }

  mutation AddTimesheetEntry($date: String!) {
    addTimesheetEntry(date: $date) {
          id,
      date
    }
  }
```

```
{
  "id": 1,
  "date": "booyah"
}
```

## creating the ecs cluster:

create a key pair:
from: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair
(https://docs.aws.amazon.com/cli/latest/reference/ec2/create-key-pair.html)

 1. `aws ec2 create-key-pair --key-name "get-paid-key" --region us-east-1`
 2. save the ascii output (KeyMaterial) to a file - this is your private key (pem file)

from: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cli-tutorial-ec2.html

 1. `ecs-cli configure --cluster get-paid --region us-east-1 --default-launch-type EC2` - store config for cluster locally
 3. `ecs-cli up –-keypair get-paid-key –-size 1 --instance-type t3.nano --capability-iam`

to delete the cluster:

 3. `ecs-cli down --cluster get-paid`

putting the image in the ECR:

 1. create the ECR repo: `aws ecr create-repository --repository-name get-paid --region us-east-1`
 2. tag the image wth the repositoryUri: `docker tag get-paid-api 277625601220.dkr.ecr.us-east-1.amazonaws.com/get-paid`
 3. get the ecr login command: `aws ecr get-login --no-include-email --region us-east-1`
 4. run the command returned
 5. push the image to the repo: `docker push 277625601220.dkr.ecr.us-east-1.amazonaws.com/get-paid`

to delete the image:
 
 1. `aws ecr delete-repository --repository-name get-paid-api --force --region us-east-1`

deploy the compose file to the cluster:

 1. set the docker registry url: `DOCKER_REGISTRY=277625601220.dkr.ecr.us-east-1.amazonaws.com/get-paid`
 2. `ecs-cli compose up` (in backend directory with the docker-compose.yml and ecs-params.yml file)
 3. see status of cluster: `ecs-cli ps`

test out container:

 1. ???

## todo

### overall

 * get branch deployment working (canary deployments)
 * standardise all node projects to the same setup/lint/pretty etc.
 * rename read-local-file to some sort of filesystem helper
 * get shared libs working - monorepo style? - for things like read-local-file
    * create a shared package for read-local-file so we aren't importing between packages
 * are the templates in the cloudformation s3 bucket shared across branches - potential bleed problem?

### authentication

 * https://medium.com/@mjw56/graphql-authentication-with-passport-d75c08d5fbdc
 * https://blog.apollographql.com/a-guide-to-authentication-in-graphql-e002a4039d1

### backend:

 * fix up the docker / be startup scripts - and be update scripts
 * add in the schema setup/ migrations into both local and remote scripts
 * create a BE STOP script and START script to reduce costs
 * get cloud hosting of graph+postgres docker containers working
 * get linting around import - mjs + lib folder working
 * move onto rds?

### ecs:

 * docker compose to change port whether locally (3000) or on ecs (80)
 * move ecs onto ssl

### graphql:

 * move to join-monster

### database (postgres):

 * get seeding/migrations working

### frontend:

### website:

 * move the website to metalsmith

### rn apps:

 * get react native debugging working
 * get mutations / invoice listing, creation editing working - more full graphql schema
 * how does the state get stored into the react-navigation props with react-apollo? how would we do something similar with react-router

### out of date now (prior to moving away from appsync+dynamo):

 * expand reusability/templating so all the Invoices specific cf resolver/datasource resources can be autogenerated from the dynamo table config + the rmt vtl templates
 * test it working against appsync online as well as local
 * where is the appsync error handling - why can't I see connection/auth errors on the appsync client?
 * get some OUTPUTs from the cf template - i.e. appsync app id - then you can chain the command: `aws appsync get-graphql-api --api-id zu62e235bzg45j4iw7bxhvytyq --region us-east-1` to the script to get the graphql endpoint

## client sharing - still testing react-native-web-starter

 * Choose web/native sharing mechanism:
  https://github.com/vincentriemer/react-native-dom
  https://github.com/joefazz/react-native-web-starter
  https://microsoft.github.io/reactxp/
  https://pickering.org/using-react-native-react-native-web-and-react-navigation-in-a-single-project-cfd4bcca16d0
  https://medium.com/@yannickdot/write-once-run-anywhere-with-create-react-native-app-and-react-native-web-ad40db63eed0
  https://github.com/viewstools/yarn-workspaces-cra-crna

## bugs

 * definitions3location was giving a 403 despite it looking like it was public-read to me shrug
   - probably should just have been a bucket name instead of a url - shouldn't have to make them public-read
   - this is because you have to do a cloudformation package to send the package to s3


 * current state of deploy: got half way through trying to configure a lambda deployment from a sam template/transform in the cloudformation package - probably almost done with it, but now moving away from lambda to ecs and containers because lambda -> rds seems problematic re: connection pooling and vpc set up creating slow cold starts.

 * https://medium.com/@tomlagier/scaffolding-a-rock-solid-graphql-api-b651c2a36438


## links

 * https://read.acloud.guru/deploy-an-aws-appsync-graphql-api-with-amazon-cloudformation-9a783fdd8491
 * good overview to the be tech here: https://code.tutsplus.com/tutorials/code-an-app-with-graphql-and-react-native--cms-30511
 * for creating the websit3e version of the app: https://docs.aws.amazon.com/appsync/latest/devguide/building-a-client-app-react.html
 * setup local machine using steps here: https://docs.expo.io/versions/v28.0.0/introduction/installation.html
 * https://github.com/viewstools/yarn-workspaces-cra-crna
 * https://medium.com/@jonnykalambay/your-first-hybrid-app-in-15-minutes-react-native-on-the-web-2cc2646051e
 * good overview of dynamodb here: https://dev.to/mushketyk/should-you-use-dynamodb-5m5
 * https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-lambda-resolvers.html
 * https://itnext.io/creating-a-blueprint-for-microservices-and-event-sourcing-on-aws-291d4d5a5817
 * https://medium.com/@mhemphill.au/event-sourcing-with-dynamo-4d692cd56649
 * https://martinfowler.com/eaaDev/EventSourcing.html
 * https://github.com/awslabs/aws-sam-cli/blob/develop/docs/installation.rst
