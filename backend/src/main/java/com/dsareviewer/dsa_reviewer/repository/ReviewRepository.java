package com.dsareviewer.dsa_reviewer.repository;

import com.dsareviewer.dsa_reviewer.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findAllByOrderByCreatedAtDesc();
}