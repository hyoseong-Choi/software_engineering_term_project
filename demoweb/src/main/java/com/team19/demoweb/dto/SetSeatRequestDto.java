package com.team19.demoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetSeatRequestDto {
    private String session;
    private String name;
    private int seatnum;
    private float x;
    private float y;
}
