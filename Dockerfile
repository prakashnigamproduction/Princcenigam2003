FROM node:14

WORKDIR /app

# Space fix after package*.json and before ./
COPY package*.json ./

RUN npm install

# Space fix after COPY
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"
