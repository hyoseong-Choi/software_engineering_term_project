package com.team19.demoweb.repository;

import com.team19.demoweb.entity.Seat;
import com.team19.demoweb.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findAllByStore(Store store);
    Optional<Seat> findByStoreAndSeatnum(Store store, int Seatnum);
}