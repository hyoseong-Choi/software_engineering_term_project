package com.team19.demoweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Store {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    
    private String name;

    @Builder
    public Store(User user, String name) {
        this.user = user;
        this.name = name;;
    }
}