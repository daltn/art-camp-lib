BEGIN TRANSACTION;
CREATE TEMPORARY TABLE t1_backup(id,filename,artist,title,year);
INSERT INTO t1_backup SELECT id,filename,artist,title,year FROM catalogs;
DROP TABLE catalogs;
CREATE TABLE catalogs(id,filename,artist,title,year);
INSERT INTO catalogs SELECT id,filename,artist,title,year FROM t1_backup;
DROP TABLE t1_backup;
COMMIT;
