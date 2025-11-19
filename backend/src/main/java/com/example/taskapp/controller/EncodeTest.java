package com.example.taskapp.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class EncodeTest {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("testpass"));
    }
}
