package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Role;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public List<String> addRoles(List<String> roleNameList) {
        if (roleNameList.isEmpty()) {
            throw new BadRequestException("Role list shouldn't be empty");
        }
        return roleNameList.stream()
                .filter(name -> roleRepository.findRoleByName(name).isEmpty())
                .peek(name -> roleRepository.save(Role.builder().name(name).build()))
                .toList();
    }

    public void deleteRole(String roleName) {
        Role role = roleRepository.findRoleByName(roleName)
                .orElseThrow(() -> new BadRequestException("Role '" + roleName + "' not found"));
        // Protect critical system roles
        if (roleName.equals("ADMIN") || roleName.equals("OWNER") || roleName.equals("VET")) {
            throw new BadRequestException("Cannot delete system role '" + roleName + "'");
        }
        roleRepository.delete(role);
    }
}
