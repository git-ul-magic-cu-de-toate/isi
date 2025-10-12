CREATE TABLE Posts (
    Id INT AUTO_INCREMENT PRIMARY KEY,    -- Primary key with auto-increment
    Title VARCHAR(255) NOT NULL,          -- Title of the post
    Content TEXT NOT NULL,                -- Content of the post
    Author VARCHAR(100) NOT NULL,         -- Author of the post
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last update timestamp
);
