FROM mhart/alpine-node:10
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
ADD . .
RUN yarn && yarn setup
CMD yarn start
