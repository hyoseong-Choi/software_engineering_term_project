package com.team19.demoweb.Controller;

import com.team19.demoweb.dto.UserChangePwdRequestDto;
import com.team19.demoweb.dto.UserExitRequestDto;
import com.team19.demoweb.dto.UserInfoRequestDto;
import com.team19.demoweb.dto.UserLogInRequestDto;
import com.team19.demoweb.dto.UserLogOutRequestDto;
import com.team19.demoweb.dto.UserSignInRequestDto;
import com.team19.demoweb.entity.User;
import com.team19.demoweb.repository.SessionMemory;
import com.team19.demoweb.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@Controller
@RestController

public class UserController {

    private final UserRepository userRepository;
    private final SessionMemory sessionMemory;
    
    public UserController(UserRepository userRepository, SessionMemory sessionMemory){
        this.userRepository = userRepository;
        this.sessionMemory = sessionMemory;
    }

    //회원가입
    @PostMapping("/api/signin")
    public String signInV2(@RequestBody UserSignInRequestDto dto){
        //유저 객체 생성
        User user = new User(dto.getEmail(), dto.getPw(), dto.getName());
        //유저 아이디가 중복되지 않을 시
        if(userRepository.findByEmail(user.getEmail()).isEmpty()){ 
            //유저 객체 레포지토리에 저장
            userRepository.save(user);
            return "Sign in complete";
        } else{
            return "ID already used";
        }
    }

    //로그인
    @PostMapping("/api/login")
    public String loginV2(@RequestBody UserLogInRequestDto dto){
        Optional<User> user = userRepository.findByEmail(dto.getEmail());
        System.out.println("----------\n");
        if(user.isEmpty()){//존재하지 않는 유저(이메일)일때
            return "sign up first";
        }
        if(user.get().getPw().equals(dto.getPw())){
            //세션 생성 및 유저에게 부여
            return sessionMemory.createSession(user.get());
        }else{//비밀번호가 틀릴때
            return "login fail";
        }
    }
    //로그아웃
    @PostMapping("/api/logout")
    public String loginV2(@RequestBody UserLogOutRequestDto dto){
        // session 확인
        String session = dto.getSession();
        if(session.equals(null)){
            return "Invalid Session";
        }
        //HashMap에 세션 삭제 요청 후 반환값 확인
        if(sessionMemory.deleteSession(session).equals(null)){
            return "Session Not Found";
        }
        return "Log out completed";
    }
    
    //회원 정보 조회
    @PostMapping("/api/userinfo")
    public User userInfoV2(@RequestBody UserInfoRequestDto dto){
        //세션 확인
        User user;
        try {
            user = checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        //유저 객체 반환
        return user;
    }
    //회원 탈퇴
    @PostMapping("/api/exit")
    public String exitV2(@RequestBody UserExitRequestDto dto){
        // session 확인
        User user;
        try {
            user = checkSession(dto.getSession());
        } catch (Exception e) {
            return "Invalid Session";
        }
        //비밀번호 대조
        if(!dto.getPw().equals(user.getPw())) return"Password Incorrect";
        //유저 삭제
        userRepository.delete(user);
        return "Sign out succeeded";
    }
    //비밀번호 변경
    @Transactional
    @PostMapping("/api/changepwd")
    public String changePwdV2(@RequestBody UserChangePwdRequestDto dto){
        // session 확인
        User user;
        try {
            user = checkSession(dto.getSession());
        } catch (Exception e) {
            return "세션이 유효하지 않습니다";
        }
        //비밀번호 대조
        if(!dto.getPw().equals(user.getPw())) return"Password Incorrect";
        //새 비밀번호 확인
        if(!dto.getChkPw().equals(dto.getNewPw())) return"New Password doesn't matches";
        //비밀번호 재설정
        user.setPw(dto.getNewPw());
        return "Password Updated";
    }

    //세션 검증
    public User checkSession(String s){
        String session = s;
        Long search = sessionMemory.findUser(session);
        // 세션을 통해 유저 검색 후 반환
        return userRepository.findById(search).get();
    }
}