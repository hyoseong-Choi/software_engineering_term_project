/*package com.team19.demoweb;

import com.team19.demoweb.entity.Seats;
import com.team19.demoweb.entity.Store;
import com.team19.demoweb.repository.ItemRepository;
import com.team19.demoweb.repository.SeatsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class StoreTest {
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    SeatsRepository seatsRepository;
    
    @Test
    @Transactional
    //@Rollback(false)
    public void testSeats() {
        Seats seats = new Seats();
        Store store = new Store();
        store.setStore("gytjd1");
        store.setId(1L);
        seats.setStore_id(store);
        seatsRepository.save(seats);
    
    }
}*/
