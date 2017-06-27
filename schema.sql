--
-- File generated with SQLiteStudio v3.1.1 on Tue Jun 27 16:30:10 2017
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Player
DROP TABLE IF EXISTS Player;
CREATE TABLE Player (Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, Cookie INTEGER UNIQUE NOT NULL, Email TEXT, InfoAboutPrato BOOLEAN DEFAULT (0), InfoAboutVacancies BOOLEAN DEFAULT (0), RecruitmentIdentifier TEXT);

-- Table: Session
DROP TABLE IF EXISTS Session;
CREATE TABLE Session (Id INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, PlayerId INTEGER REFERENCES Player (Id), StartDate DATETIME NOT NULL, LastInput DATETIME, InputData TEXT, FreeComment TEXT, Level TEXT);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
