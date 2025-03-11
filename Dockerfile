# Sử dụng Node.js bản mới nhất với Alpine cho build stage
FROM node:alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Copy tất cả các file trong thư mục project
COPY . .

# Đặt PUBLIC_URL để sử dụng đường dẫn tương đối
ENV PUBLIC_URL="."

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng React đã build
FROM nginx:alpine

# Sao chép các file build từ builder stage vào thư mục html của nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Tạo thư mục Avatar nếu chưa tồn tại
RUN mkdir -p /usr/share/nginx/html/Avatar

# Sao chép các hình ảnh Avatar (giả định chúng nằm trong thư mục public/Avatar của dự án)
COPY --from=builder /app/public/Avatar/* /usr/share/nginx/html/Avatar/

# Tạo thư mục chứa SSL certificate
RUN mkdir -p /etc/nginx/ssl

# Tạo self-signed certificate
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=VN/ST=State/L=City/O=Organization/CN=10.170.100.152"

# Sao chép file cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cả hai cổng HTTP và HTTPS
EXPOSE 3000 3001

# Khởi chạy nginx khi container được khởi động
CMD ["nginx", "-g", "daemon off;"]