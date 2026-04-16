package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.RoleService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/v1/role")
public class RoleController implements SecuredRestController{

    private static final Logger logger = LoggerFactory.getLogger(RoleController.class);

    @Autowired
    private RoleService roleService;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> addRoles(@RequestBody List<String> roleList) {
        logger.info("Request to add roles {}", roleList);
        List<String> addedRoles = roleService.addRoles(roleList);
        logger.info("Successfully added roles {}", addedRoles);

        ApiResponseDto response = ApiResponseDto.builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Roles added: " + addedRoles)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
