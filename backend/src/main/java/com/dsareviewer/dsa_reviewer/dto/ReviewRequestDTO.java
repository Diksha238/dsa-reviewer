package com.dsareviewer.dsa_reviewer.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequestDTO {

    @NotBlank(message = "Code cannot be empty")
    private String code;

    @NotBlank(message = "Language cannot be empty")
    private String language;

    private String problemDescription;
}