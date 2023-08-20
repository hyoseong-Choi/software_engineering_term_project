package com.team19.demoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EndtimeRequestDto {
    private String session;
    private int seatnum;
}
