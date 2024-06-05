package com.example.backend.quality;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/qualities")
public class QualityController {

    private final QualityService qualityService;

    @Autowired
    public QualityController(QualityService qualityService) {
        this.qualityService = qualityService;
    }

    @GetMapping
    public ResponseEntity<List<Quality>> getAllQualities() {
        List<Quality> qualities = qualityService.getAllQualities();
        return new ResponseEntity<>(qualities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quality> getQualityById(@PathVariable("id") UUID id) {
        Quality quality = qualityService.getQualityById(id);
        if (quality == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(quality, HttpStatus.OK);
    }
}
