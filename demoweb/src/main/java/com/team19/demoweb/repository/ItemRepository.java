package com.team19.demoweb.repository;

import com.team19.demoweb.entity.Item;
import com.team19.demoweb.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findAllByStore(Store store);
    Item findByStoreAndName(Store store, String name);
}