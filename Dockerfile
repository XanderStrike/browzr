FROM golang as builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o browzr

FROM scratch
WORKDIR /app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /app/browzr .
COPY index.html .
COPY styles.css .
COPY script.js .

VOLUME /app/files/
EXPOSE 3000
ENTRYPOINT ["/app/browzr"]
