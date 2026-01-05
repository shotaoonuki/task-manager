package com.example.taskapp.service.calendar;

import com.google.api.client.auth.oauth2.Credential;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class GoogleCalendarRestService {

    private final GoogleOAuthService oauthService;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://www.googleapis.com/calendar/v3")
            .build();

    public String createAllDayEvent(
            String title,
            String description,
            LocalDate startDate,
            int durationDays
    ) throws Exception {

        Credential credential = oauthService.authorize();

        String body = """
        {
          "summary": "%s",
          "description": "%s",
          "start": { "date": "%s" },
          "end": { "date": "%s" }
        }
        """.formatted(
                title,
                description,
                startDate,
                startDate.plusDays(durationDays)
        );

        return webClient.post()
                .uri("/calendars/primary/events")
                .header("Authorization", "Bearer " + credential.getAccessToken())
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
