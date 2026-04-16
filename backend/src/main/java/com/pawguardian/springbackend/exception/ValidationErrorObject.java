package com.pawguardian.springbackend.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorObject {

    @JsonProperty("error_code")
    private Integer statusCode;

    @JsonProperty("error_message")
    private String message;

    @JsonProperty("validation_errors")
    private Map<String, String> validationErrors;

    @JsonProperty("path")
    private String path;

    @JsonProperty("error_timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
}

