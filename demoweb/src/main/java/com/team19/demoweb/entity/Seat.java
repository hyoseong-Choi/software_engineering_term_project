package com.team19.demoweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter

@NoArgsConstructor
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;
    @Column
    private boolean available;
    private int seatnum;
    private float x;
    private float y;
    
    private LocalDateTime endtime;
    
    public Seat(Long id, Store store, int seatnum, float x, float y) {
        this.id = id;
        this.store = store;
        this.seatnum = seatnum;
        this.x = x;
        this.y = y;
    }
    
    public Seat(Long id, Store store, int seatnum) {
        this.id = id;
        this.store = store;
        this.seatnum = seatnum;
    }
    
    public Seat(Store store, boolean available, int seatnum, float x, float y) {
        this.store = store;
        this.available = available;
        this.seatnum = seatnum;
        this.x = x;
        this.y = y;
    }
    
    public Seat(Store store, int seatnum) {
        this.store = store;
        this.seatnum = seatnum;
    }
}