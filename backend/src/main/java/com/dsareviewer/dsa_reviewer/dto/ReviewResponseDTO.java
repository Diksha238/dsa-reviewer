package com.dsareviewer.dsa_reviewer.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponseDTO {
    private Long id;
    private String feedback;
    private Integer score;
    private String language;
    private String problemDescription;
//    @JsonSerialize(using = LocalDateTimeSerializer.class)
//    private LocalDateTime createdAt;
}