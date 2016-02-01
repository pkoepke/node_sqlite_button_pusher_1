select * from button_info;/* get all data */

/*DELETE FROM button_info WHERE rowid > 10;*/

/*ALTER TABLE button_info  ADD COLUMN dateTime2 DATETIME DEFAULT 20110126143000;*/

/* UPDATE button_info SET dateTime2 = '2016-01-31T16:45:46+00:00' WHERE rowid < 100; */

/* PRAGMA table_info(button_info); /* get table info */

/* Since SQLite doesn't suppor DROP COLUMN, this giant transaction with a temp table is requred to remove a column*/
/*BEGIN TRANSACTION;
CREATE TEMPORARY TABLE button_info_backup(datetime, clientIp);
INSERT INTO button_info_backup SELECT datetime, clientIp FROM button_info;
DROP TABLE button_info;
CREATE TABLE button_info(datetime, clientIp);
INSERT INTO button_info SELECT datetime, clientIp FROM button_info_backup;
DROP TABLE button_info_backup;
COMMIT; /* end transaction */