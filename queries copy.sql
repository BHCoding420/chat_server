CREATE TABLE Users (
    ID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    PLZ varchar(10),
    Telephone varchar(25),
    Password varchar(255)
);


ALTER TABLE Users
ADD PRIMARY KEY (ID);

INSERT INTO Users (ID, LastName, FirstName, Address, City, PLZ,Telephone, Password)
VALUES ('987080','Issa','Khodor','Freisener Straße 8','Namborn','66640','+49 8192121891','123456');

CREATE TABLE `Messages` (`Sender` varchar(255) NOT NULL,`Reciever` varchar(255) NOT NULL,`Content` varchar(255) DEFAULT NULL,`Seen` tinyint DEFAULT NULL,`MessageId` int PRIMARY KEY)

ALTER TABLE Messages ALTER Date SET DEFAULT CURRENT_DATE();

Select Email,Sender,Reciever,Content,Date from Users,Messages where Sender = "bhcoding69@gmail.com" OR Reciever = "bhcoding69@gmail.com" GROUP BY Email;