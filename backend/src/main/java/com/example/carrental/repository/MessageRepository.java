package com.example.carrental.repository;

import com.example.carrental.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCarId(Long carId);
    List<Message> findByRecipientId(Long recipientId);
}
