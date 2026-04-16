# 1. Usamos una imagen de Node.js
FROM node:18

# 2. Creamos el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código
COPY . .

# 6. Exponemos el puerto que usa tu API (ejemplo 8080 o el que uses)
EXPOSE 8080

# 7. Comando para arrancar la app
CMD ["node", "index.js"]
