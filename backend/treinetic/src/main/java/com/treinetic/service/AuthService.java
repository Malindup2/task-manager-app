package com.treinetic.service;

import com.treinetic.dto.AuthRequestDTO;
import com.treinetic.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO register(AuthRequestDTO dto);
    AuthResponseDTO login(AuthRequestDTO dto);
}
