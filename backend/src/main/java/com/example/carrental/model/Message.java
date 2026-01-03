package com.example.carrental.model;

import javax.persistence.*;
import java.time.Instant;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User sender;
    @ManyToOne
    private User recipient;
    @ManyToOne
    private Car car;
    private String text;
    private Instant sentAt = Instant.now();

    public Message() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }
}
