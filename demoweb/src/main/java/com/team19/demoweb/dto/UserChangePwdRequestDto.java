package com.team19.demoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserChangePwdRequestDto {
    private String session;
    private String pw;
    private String newPw;
    private String chkPw;
}
