FROM node:20-slim

WORKDIR /src

#COPY package.json .
COPY ./ ./

#RUN npm install
RUN npm -y install 

#COPY . .

EXPOSE 3000


#CMD [ "npm", "start" ]
CMD ["npm","run","start"]
