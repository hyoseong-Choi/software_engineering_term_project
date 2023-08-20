package com.team19.demoweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Item {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;
    @Column (name = "name")
    private String name;
    @Column
    private int price;
    @Column
    private int time;
    
    public Item(Store store, String name, int price, int time) {
        this.store = store;
        this.name = name;
        this.price = price;
        this.time = time;
    }
}