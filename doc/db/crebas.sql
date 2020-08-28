/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2020/8/27 18:00:15                           */
/*==============================================================*/


drop table if exists m_charactor;

drop table if exists m_word;

/*==============================================================*/
/* Table: m_charactor                                           */
/*==============================================================*/
create table m_charactor
(
   charactor_id         int not null auto_increment,
   charactor            varchar(50),
   pinyin               varchar(50),
   grade                int,
   term                 int,
   multi_flag           int default 0,
   notes                varchar(256),
   created_user_id      int,
   created_at           datetime default CURRENT_TIMESTAMP,
   updated_at           datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted_at           datetime,
   primary key (charactor_id)
);

/*==============================================================*/
/* Table: m_word                                                */
/*==============================================================*/
create table m_word
(
   word_id              int not null auto_increment,
   word                 varchar(50),
   pinyin               varchar(100),
   grade                int,
   term                 int,
   multi_flag           int default 0,
   excellent            int comment 'ÓÅÐã¼¶±ð',
   notes                varchar(256),
   created_user_id      int,
   created_at           datetime default CURRENT_TIMESTAMP,
   updated_at           datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted_at           datetime,
   primary key (word_id)
);

