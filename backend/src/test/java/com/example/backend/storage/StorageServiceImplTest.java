package com.example.backend.storage;

import static org.junit.jupiter.api.Assertions.*;
import com.example.backend.exceptions.StorageException;
import com.example.backend.exceptions.StorageFileNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;

class StorageServiceImplTest {
    private StorageServiceImpl storageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        storageService = new StorageServiceImpl(tempDir.toString());
        storageService.init();
    }

    @Test
    void testStoreNotEmptyFile() throws Exception {
        MultipartFile multipartFile = new MockMultipartFile(
                "testfile.txt", "testfile.txt", "text/plain", "Hello, World!".getBytes());

        String storedFilename = storageService.store(multipartFile);
        assertTrue(Files.exists(tempDir.resolve(storedFilename)), "File should be stored successfully");
    }

    @Test
    void testStoreEmptyFileThrowsException() {
        MultipartFile emptyFile = new MockMultipartFile("empty.txt", "empty.txt", "text/plain", new byte[0]);
        Exception exception = assertThrows(StorageException.class, () -> {
            storageService.store(emptyFile);
        });
        assertTrue(exception.getMessage().contains("Failed to store empty file"));
    }

    @Test
    void testLoadFileSuccess() {
        MultipartFile multipartFile = new MockMultipartFile(
                "testfile.txt", "testfile.txt", "text/plain", "Hello, World!".getBytes());
        storageService.store(multipartFile);
        Path loadedFile = storageService.load("testfile.txt");
        assertTrue(Files.exists(loadedFile), "File should be loadable");
    }

    @Test
    void testLoadFileNotFound() {
        String filename = "nonexistent.txt";
        StorageFileNotFoundException exception = assertThrows(StorageFileNotFoundException.class, () -> {
            storageService.load(filename);
        }, "Expected StorageFileNotFoundException to be thrown for missing file");

        assertTrue(exception.getMessage().contains("Could not read file"), "Exception message should indicate problem with reading file");
    }

    @Test
    void testLoadAllFiles() throws Exception {
        storageService.store(new MockMultipartFile("a.txt", "a.txt", "text/plain", "A file".getBytes()));
        storageService.store(new MockMultipartFile("b.txt", "b.txt", "text/plain", "B file".getBytes()));

        assertEquals(2, storageService.loadAll().collect(Collectors.toList()).size(), "Should load all files");
    }

    @Test
    void testDeleteAllFiles() throws Exception {
        storageService.store(new MockMultipartFile("a.txt", "a.txt", "text/plain", "A file".getBytes()));
        storageService.deleteAll();

        assertDoesNotThrow(() -> {
            long fileCount = Files.exists(tempDir) ? Files.list(tempDir).count() : -1;
            assertEquals(0, fileCount, "All files should be deleted");
        });
    }
}
