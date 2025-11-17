# ✅ 安定してRenderで動作するJava 17 イメージ
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/taskapp-0.0.1-SNAPSHOT.jar"]
