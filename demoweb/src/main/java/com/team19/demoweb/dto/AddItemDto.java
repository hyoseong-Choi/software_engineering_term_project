package com.team19.demoweb.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddItemDto {
    private String session;
    private String storename;
    private String itemname;
    private int price;
    private int time;
}
