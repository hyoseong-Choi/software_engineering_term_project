package com.team19.demoweb.Controller;

import com.team19.demoweb.dto.*;
import com.team19.demoweb.entity.*;
import com.team19.demoweb.repository.ItemRepository;
import com.team19.demoweb.repository.SeatRepository;
import com.team19.demoweb.repository.StoreRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin("http://localhost:3000")
@Controller
@RestController
public class StoreController {
    private final StoreRepository storeRepository;
    private final SeatRepository seatRepository;
    private final ItemRepository itemRepository;
    private final UserController userController;
    
    public StoreController(StoreRepository storeRepository, SeatRepository seatRepository, ItemRepository itemRepository, UserController userController) {
        this.storeRepository = storeRepository;
        this.seatRepository = seatRepository;
        this.itemRepository = itemRepository;
        this.userController = userController;
    }
    //store정보 설정
    @PostMapping("/api/setstore")
    public String setStore(@RequestBody SetStoreRequestDto dto) {
        //session 검증 후 user 정보 가져오기
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return "Invalid Session";
        } 

        /* 
         **사업자 번호 검증 부분 추가 필요
        */

        //store정보 기반으로 객체 생성후, user와 관계 설정 후 저장
        Store store = new Store(user, dto.getName());
        storeRepository.save(store);
        return "Store information setting Sucessful";
    }
    
    //store정보 설정
    @PostMapping("/api/deletestore")
    public String deleteStore(@RequestBody SetStoreRequestDto dto) {
        //Optional<User> user = userRepository.findByStore(store.getUser().getStore());
        //session 검증 후 user 정보 가져오기
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return "Invalid Session";
        }
        
        /*
         **사업자 번호 검증 부분 추가 필요
         */
        
        //store정보 기반으로 객체 생성후, user와 관계 설정 후 저장
        Store store = new Store(user, dto.getName());
        storeRepository.delete(store);
        return "Store information setting Sucessful";
    }
    
    @PostMapping("/api/setseat")//seat 생성
    public String setSeat(@RequestBody SetSeatRequestDto dto) {
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return "Invalid Session";
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        //좌석이 이미 있으면
        if(seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).isPresent()){
            Seat seat = new Seat(seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get().getId(),
                    store.get(), dto.getSeatnum(), dto.getX(), dto.getY());
            seatRepository.save(seat);
            return "Success";
        }
        Seat seat = new Seat(store.get(), true, dto.getSeatnum(), dto.getX(), dto.getY());
        seat.setEndtime(null);
        seatRepository.save(seat);
        return "Success";
    }
    
    @DeleteMapping("/api/setseat")//seat 제거
    public String deleteSeat(@RequestBody DeleteSeatDto dto) {
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return "Invalid Session";
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Seat seat = new Seat(seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get().getId(), store.get(), dto.getSeatnum());
        seatRepository.delete(seat);
        return "Success";
    }
    
    //해당 store의 전체 seat정보 제공
    @PostMapping("/api/seatinfo")
    public List<Seat> getseatInfo(@RequestBody SeatInfoRequestDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        //user와 조인된 store 정보를 기반으로 전체 seat정보 반환
        Optional<Store> store = storeRepository.findById(user.getId());
        return seatRepository.findAllByStore(store.get());
    }
    
    //어느가게의 몇번좌석에서 무슨음료샀는지 클라이언트가보내면
    @PostMapping("/api/setpurchase")
    public int purchaseOnSeat(@RequestBody PurchaseOnSeatRequestDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return 0;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Seat seat = seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get();
        seat.setAvailable(false);
        Item item = itemRepository.findByStoreAndName(store.get(), dto.getItem());
        seat.setEndtime(LocalDateTime.now().withNano(0).plusSeconds(item.getTime()).withNano(0));
        seatRepository.save(seat);//좌석현황최신화
        return item.getTime();
    }
    
    //프론트에서 요청한 좌석의 종료시간 가져와서 보내줌
    @PostMapping("/api/endtime")
    public LocalDateTime endtime(@RequestBody EndtimeRequestDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Seat seat = seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get();
        return seat.getEndtime();
    }
    @PostMapping("/api/seatavailable")
    public String seatavaiable(@RequestBody SeatAvaiableDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Seat seat = seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get();
        if (seat.isAvailable()) {
            seat.setAvailable(false);
            seatRepository.save(seat);
            return "Set seat Unavailable";
        } else {
            seat.setAvailable(true);
            seat.setEndtime(null);
            seatRepository.save(seat);
            return "Set seat Available";
        }
    }
    
    @PostMapping("/api/timeover")//좌석시간 끝난거 받음
    public String endseatInfo(@RequestBody TimeoverDto dto) {
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Seat seat = seatRepository.findByStoreAndSeatnum(store.get(), dto.getSeatnum()).get();
        seat.setAvailable(true);
        seat.setEndtime(null);
        seatRepository.save(seat);//좌석현황최신화
        return  "Success";
    }
    
    @PostMapping("/api/additem")
    public String additem(@RequestBody AddItemDto dto) {
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Item item = new Item(store.get(), dto.getItemname(), dto.getPrice(), dto.getTime());
        itemRepository.save(item);
        return "Add item success";
    }
    
    @PostMapping("/api/deleteitem")
    public String deleteitem(@RequestBody AddItemDto dto) {
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        Optional<Store> store = storeRepository.findById(user.getId());
        Item item = itemRepository.findByStoreAndName(store.get(), dto.getItemname());
        itemRepository.delete(item);
        return "Delete item success";
    }
    
    //유저에 따른 store정보 클라에 제공
    @PostMapping("/api/storeinfo")
    public Optional<Store> getStore(@RequestBody StoreInfoRequestDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        // user와 연결된 store 검색 후 반환
        Optional<Store> store = storeRepository.findById(user.getId());
        return store;
    }

    @PostMapping("/api/menus")
    public List<Item> getmenu(@RequestBody StoreInfoRequestDto dto) {
        //session 검증
        User user;
        try {
            user = userController.checkSession(dto.getSession());
        } catch (Exception e) {
            return null;
        }
        // user와 연결된 store 검색 후 반환
        Optional<Store> store = storeRepository.findById(user.getId());
        return itemRepository.findAllByStore(store.get());
    }
}