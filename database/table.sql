CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255),
    Age INT,
    Gender VARCHAR(10),
    Location VARCHAR(100),
    FosterStatus VARCHAR(50),  -- e.g., "Aged Out"
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tutors (
    TutorID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Subjects VARCHAR(255),  -- e.g., "Math, Science"
    Qualifications TEXT,
    Availability VARCHAR(100),
    Location VARCHAR(100),
    HourlyRate DECIMAL(5, 2),
    ContactInfo VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Scholarships (
    ScholarshipID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    EligibilityCriteria TEXT,
    ApplicationDeadline DATE,
    Amount DECIMAL(10, 2),
    ContactInfo VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Resources (
    ResourceID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    URL VARCHAR(255),
    Category VARCHAR(50),  -- e.g., "Educational", "Mental Health"
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ChatMessages (
    MessageID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    MessageText TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

