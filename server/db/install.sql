SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `PERSONS_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(12) NOT NULL,
  `FAM` varchar(15) NOT NULL,
  `ADDRESS` varchar(33) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

INSERT INTO `PERSONS_TBL` (`ID`, `NAME`, `FAM`, `ADDRESS`) VALUES
(1, 'Boian', 'Katzarsky', 'Ul. 222'),
(2, 'Velko', 'Iltchev', 'Plovdiv, 4000'),
(3, 'Ani', 'Dimitrova', 'Plovdiv, 60'),
(4, 'Bruce', 'Willis', 'Los Angeles, CA');

CREATE TABLE IF NOT EXISTS `TELS_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PID` int(11) NOT NULL,
  `TID` int(11) NOT NULL,
  `NOMER` varchar(33) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

INSERT INTO `TELS_TBL` (`ID`, `PID`, `TID`, `NOMER`) VALUES
(1, 1, 1, '032 / 123 4560'),
(2, 1, 2, '0886 103 482'),
(3, 2, 3, ''),
(6, 3, 1, '02 / 456 8790');

CREATE TABLE IF NOT EXISTS `TELTYPES_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TELTYPE` varchar(10) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO `TELTYPES_TBL` (`ID`, `TELTYPE`) VALUES
(1, 'home'),
(2, 'mobile'),
(3, 'office'),
(4, 'email');
