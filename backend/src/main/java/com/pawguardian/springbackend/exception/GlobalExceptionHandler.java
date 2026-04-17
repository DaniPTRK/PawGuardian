package com.pawguardian.springbackend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorObject> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        logger.warn("Validation failed for request {}: {}", request.getDescription(false), errors);

        ValidationErrorObject errorObject = ValidationErrorObject.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed for the request")
                .validationErrors(errors)
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorObject> handleBadRequest(BadRequestException ex, WebRequest request) {
        logger.warn("Bad request at {}: {}", request.getDescription(false), ex.getMessage());
        ErrorObject errorObject = ErrorObject.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<ErrorObject> handleInternalServerError(InternalServerErrorException ex, WebRequest request) {
        logger.error("Internal server error at {}: {}", request.getDescription(false), ex.getMessage());
        ErrorObject errorObject = ErrorObject.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorObject> handleGlobalException(Exception ex, WebRequest request) {
        logger.error("Unhandled exception [{}] at {}: {}", ex.getClass().getName(), request.getDescription(false), ex.getMessage(), ex);
        ErrorObject errorObject = ErrorObject.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An internal server error occurred. Please try again later.")
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
