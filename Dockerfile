FROM node:alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Copy tất cả các file trong thư mục project
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng React đã build
FROM nginx:alpine

# Sao chép các file build từ builder stage vào thư mục html của nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Sao chép file cấu hình Nginx (tùy chọn)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cổng Nginx chạy (mặc định 80)
EXPOSE 3000

# Khởi chạy nginx khi container được khởi động
CMD ["nginx", "-g", "daemon off;"]
