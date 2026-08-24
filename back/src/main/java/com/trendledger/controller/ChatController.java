package com.trendledger.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.ChatMessage;
import com.trendledger.domain.ChatSendRequest;
import com.trendledger.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

	private final ChatService chatService;

	public ChatController(ChatService chatService) {
		this.chatService = chatService;
	}

	@GetMapping
	public List<ChatMessage> getHistory(@RequestAttribute("userId") Long userId) {
		return chatService.getHistory(userId);
	}

	@PostMapping
	public ChatMessage send(@RequestAttribute("userId") Long userId, @RequestBody ChatSendRequest request) {
		return chatService.sendMessage(userId, request.message());
	}

	@DeleteMapping
	public void clear(@RequestAttribute("userId") Long userId) {
		chatService.clearHistory(userId);
	}

}
