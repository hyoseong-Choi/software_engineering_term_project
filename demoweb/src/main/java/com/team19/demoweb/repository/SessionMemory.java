package com.team19.demoweb.repository;

import java.util.HashMap;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.team19.demoweb.entity.User;

@Repository
public class SessionMemory {
    private HashMap<String, Long> repo = new HashMap<>();
    // DB로 추후 이동
    public Long findUser(String sessionKey){
        return repo.get(sessionKey);
    }

    public String createSession(User user){
        String sessionId = UUID.randomUUID().toString();
        repo.put(sessionId , user.getId());
        return sessionId;
    }
    public String deleteSession(String sessionKey){
        if(repo.containsKey(sessionKey)){
            repo.remove(sessionKey);
           return "Session deleted"; 
        }
        return null;
    }
}