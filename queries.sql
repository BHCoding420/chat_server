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

Select Email From Users join Messages ON  Users.Email = Messages.Sender Or Users.Email = Messages.Reciever where Sender="hodahamade10@gmail.com" Or Reciever="hodahamade10@gmail.com" group by Email;


use b5xac9nkorjkmvx0ujv6;

Select Email,Sender,Reciever,Content From Users join Messages ON  Users.Email = Messages.Sender Or Users.Email = Messages.Reciever where Sender="basharhamade99@gmail.com" Or Reciever="basharhamade99@gmail.com" group by Email

Select * FROM Users join Messages ON  Users.Email = Messages.Sender Or
Users.Email = Messages.Reciever  group by Sender,Reciever