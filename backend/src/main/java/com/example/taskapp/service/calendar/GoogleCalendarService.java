package com.example.taskapp.service.calendar;

import java.time.LocalDate;
import org.springframework.stereotype.Service;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;

import com.google.api.client.util.DateTime;

@Service
public class GoogleCalendarService {

        private final GoogleOAuthService oAuthService;

        public GoogleCalendarService(GoogleOAuthService oAuthService) {
                this.oAuthService = oAuthService;
        }

        /**
         * 汎用：Googleカレンダーに予定を登録する
         */
        public void createEvent(String summary, String description, DateTime start, DateTime end)
                        throws Exception {

                Credential credential = oAuthService.authorize();

                var httpTransport = GoogleNetHttpTransport.newTrustedTransport();
                var jsonFactory = JacksonFactory.getDefaultInstance();

                Calendar calendar = new Calendar.Builder(httpTransport, jsonFactory, credential)
                                .setApplicationName("Task Manager AI Agent").build();

                Event event = new Event().setSummary(summary).setDescription(description)
                                .setStart(new EventDateTime().setDateTime(start)
                                                .setTimeZone("Asia/Tokyo"))
                                .setEnd(new EventDateTime().setDateTime(end)
                                                .setTimeZone("Asia/Tokyo"));

                calendar.events().insert("primary", event).execute();
        }

        public void createAllDayEvent(String title, String description, LocalDate startDate,
                        LocalDate endDate) throws Exception {

                var httpTransport = GoogleNetHttpTransport.newTrustedTransport();
                var jsonFactory = JacksonFactory.getDefaultInstance();

                Credential credential = oAuthService.authorize();

                Calendar calendar = new Calendar.Builder(httpTransport, jsonFactory, credential)
                                .setApplicationName("Task Manager AI Agent").build();

                Event event = new Event().setSummary(title).setDescription(description);

                EventDateTime start =
                                new EventDateTime().setDate(new DateTime(startDate.toString()))
                                                .setTimeZone("Asia/Tokyo");

                EventDateTime end = new EventDateTime().setDate(new DateTime(endDate.toString()))
                                .setTimeZone("Asia/Tokyo");

                event.setStart(start);
                event.setEnd(end);

                calendar.events().insert("primary", event).execute();
        }

}

