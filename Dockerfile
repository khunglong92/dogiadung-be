# Dockerfile
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json & cài đặt dependencies
COPY package*.json ./
RUN yarn install

# Copy toàn bộ mã nguồn
COPY . .

# Build NestJS (chuyển TS -> JS)
RUN yarn build

# Cổng app
EXPOSE 3000

# Chạy app
CMD ["yarn", "start:prod"]