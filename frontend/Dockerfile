# # ===========================
# # 1) Build Stage
# # ===========================
# FROM node:18 AS builder

# WORKDIR /app

# # package.json をコピー（プロジェクトルートにある）
# COPY package*.json ./

# RUN npm install

# # ソースをコピー
# COPY . .

# RUN npm run build

# # ===========================
# # 2) Run Stage
# # ===========================
# FROM nginx:alpine

# COPY src/nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# ===========================
# 1) Build Stage
# ===========================
FROM node:18 AS builder

WORKDIR /app

# ① API URL を受け取る
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install

COPY . .

# ② ビルド時に VITE_API_URL が注入される
RUN npm run build

# ===========================
# 2) Run Stage
# ===========================
FROM nginx:alpine

COPY src/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

