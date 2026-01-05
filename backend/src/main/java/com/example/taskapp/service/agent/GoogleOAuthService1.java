// package com.example.taskapp.service.agent;

// import com.google.api.client.auth.oauth2.Credential;
// import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
// import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
// import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
// import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.jackson2.JacksonFactory;
// import com.google.api.client.util.store.FileDataStoreFactory;

// import org.springframework.stereotype.Service;

// import java.io.File;
// import java.io.InputStreamReader;
// import java.util.List;

// // @Service
// public class GoogleOAuthService {

// private static final JacksonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

// public Credential authorize() throws Exception {

// var httpTransport = new NetHttpTransport();

// var in = GoogleOAuthService.class.getClassLoader()
// .getResourceAsStream("client_secret.json");

// if (in == null) {
// throw new IllegalStateException("client_secret.json not found");
// }

// GoogleClientSecrets clientSecrets =
// GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

// List<String> scopes = List.of("https://www.googleapis.com/auth/calendar");

// // ★ ここが正解
// File tokenDir = new File("tokens");
// FileDataStoreFactory dataStoreFactory = new FileDataStoreFactory(tokenDir);

// GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
// httpTransport, JSON_FACTORY, clientSecrets, scopes)
// .setDataStoreFactory(dataStoreFactory)
// .setAccessType("offline").build();

// LocalServerReceiver receiver =
// new LocalServerReceiver.Builder().setPort(8888).build();

// // ★ ここでブラウザが開く
// return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
// }
// }
