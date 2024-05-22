package com.example.backend.message;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    Message saveMessage(Message message);
    List<Message> getAllMessages();
    void deleteMessage(UUID messageId);
}
