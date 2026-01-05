package com.example.taskapp.debug;

import com.example.taskapp.service.calendar.GoogleOAuthService;

public class GoogleOAuthCli {

    public static void main(String[] args) throws Exception {
        GoogleOAuthService service = new GoogleOAuthService();
        service.authorize();
        System.out.println("✅ OAuth completed successfully");
    }
}
