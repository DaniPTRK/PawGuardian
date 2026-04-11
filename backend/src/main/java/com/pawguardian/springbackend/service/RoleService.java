package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Role;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);

    public List<String> addRoles(List<String> roleNameList) {
        if (roleNameList.isEmpty()) {
            logger.info("Role list shouldn't be empty");
            throw new BadRequestException("Role list shouldn't be empty");
        }

        return roleNameList.stream()
                .filter(name -> roleRepository.findRoleByName(name).isEmpty())
                .peek(name -> {
                    Role role = Role.builder()
                            .name(name)
                            .build();
                    roleRepository.save(role);
                })
                .toList();
    }
}
