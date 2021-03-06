CREATE TABLE IF NOT EXISTS `PERSONS_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(12) NOT NULL,
  `FAM` varchar(15) NOT NULL,
  `ADDRESS` varchar(33) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

INSERT INTO `PERSONS_TBL` (`ID`, `NAME`, `FAM`, `ADDRESS`) VALUES
(1, 'Sylvester', 'Stallone', 'Chicago'),
(2, 'Jason', 'Statham', 'Louisiana'),
(3, 'Arnold', 'Schwarzenegger', 'California'),
(4, 'Chuck', 'Norris', 'Plovdiv'),
(5, 'Bruce', 'Willis', 'California');



CREATE TABLE IF NOT EXISTS `TELS_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PID` int(11) NOT NULL,
  `TID` int(11) NOT NULL,
  `NOMER` varchar(33) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO `TELS_TBL` (`ID`, `PID`, `TID`, `NOMER`) VALUES
(1, 1, 1, '032 / 123 4560'),
(2, 2, 2, '011 / 103 482'),
(3, 3, 3, '044 / 333 333'),
(4, 4, 1, '032 / 456 879');



CREATE TABLE IF NOT EXISTS `TELTYPES_TBL` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TELTYPE` varchar(10) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO `TELTYPES_TBL` (`ID`, `TELTYPE`) VALUES
(1, 'Home'),
(2, 'Mobile'),
(3, 'Office'),
(4, 'Email');
