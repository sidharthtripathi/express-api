FROM node:latest
WORKDIR /express
EXPOSE 3000
COPY package*.json ./
RUN npm install
COPY prisma .
RUN npx prisma generate
COPY . ./
RUN npx tsc -b
ENV JWT_SECRET=jwtsupersecretkey
CMD npx prisma db push && node dist