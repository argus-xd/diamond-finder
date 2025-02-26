FROM node:22

WORKDIR /srv/app

COPY package*.json ./

RUN yarn install


RUN yarn add @vue/cli-service --dev

#RUN yarn global add @vue/cli-service
#
#RUN yarn install

RUN npm install -g  @vue/cli-service

COPY . .

EXPOSE 8080

#CMD ["yarn", "serve"]

CMD ["npm", "run", "serve"]
