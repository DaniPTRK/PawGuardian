package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Feedback;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.FeedbackRepository;
import com.pawguardian.springbackend.service.dto.FeedbackRequestDto;
import com.pawguardian.springbackend.service.dto.FeedbackResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackResponseDto create(FeedbackRequestDto dto, String userEmail) {
        Feedback feedback = Feedback.builder()
                .userEmail(userEmail)
                .category(dto.getCategory())
                .rating(dto.getRating())
                .wouldRecommend(dto.getWouldRecommend())
                .mailAccuracyGood(dto.getMailAccuracyGood() != null ? dto.getMailAccuracyGood() : false)
                .experienceFriendly(dto.getExperienceFriendly() != null ? dto.getExperienceFriendly() : false)
                .vetSatisfied(dto.getVetSatisfied() != null ? dto.getVetSatisfied() : false)
                .message(dto.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
        return toResponse(feedbackRepository.save(feedback));
    }

    public List<FeedbackResponseDto> getAll() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FeedbackResponseDto getById(Long id) {
        return feedbackRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new BadRequestException("Feedback not found"));
    }

    public void delete(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new BadRequestException("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }

    private FeedbackResponseDto toResponse(Feedback f) {
        return FeedbackResponseDto.builder()
                .id(f.getId())
                .userEmail(f.getUserEmail())
                .category(f.getCategory())
                .rating(f.getRating())
                .wouldRecommend(f.getWouldRecommend())
                .mailAccuracyGood(f.getMailAccuracyGood())
                .experienceFriendly(f.getExperienceFriendly())
                .vetSatisfied(f.getVetSatisfied())
                .message(f.getMessage())
                .createdAt(f.getCreatedAt())
                .build();
    }
}

