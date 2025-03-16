package com.project.Agency;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.usertype.UserType;

@Data
public class UserRegistrationDto {

    @Email
    @NotBlank
    private String email;

    @Size(min = 8)
    @NotBlank
    private String password;

    @NotNull
    private UserType userType;
}