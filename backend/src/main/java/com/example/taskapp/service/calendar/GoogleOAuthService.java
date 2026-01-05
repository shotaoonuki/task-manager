package com.example.taskapp.service.calendar;

import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.List;

@Service
public class GoogleOAuthService {

        private static final List<String> SCOPES =
                        List.of("https://www.googleapis.com/auth/calendar");

        public Credential authorize() throws Exception {
                var httpTransport = GoogleNetHttpTransport.newTrustedTransport();
                var jsonFactory = JacksonFactory.getDefaultInstance();

                var in = getClass().getResourceAsStream("/client_secret.json");
                if (in == null) {
                        throw new IllegalStateException("client_secret.json not found");
                }

                var clientSecrets =
                                GoogleClientSecrets.load(jsonFactory, new InputStreamReader(in));

                var flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, jsonFactory,
                                clientSecrets, SCOPES)
                                                .setDataStoreFactory(new FileDataStoreFactory(
                                                                Paths.get("tokens").toFile()))
                                                .setAccessType("offline").build();

                var receiver = new LocalServerReceiver.Builder().setPort(8888).build();

                return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
        }
}
