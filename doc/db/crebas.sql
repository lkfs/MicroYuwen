/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2020/8/21 17:55:52                           */
/*==============================================================*/


drop table if exists m_article;

drop table if exists m_new_words;

/*==============================================================*/
/* Table: m_article                                             */
/*==============================================================*/
create table m_article
(
   article_id           int not null auto_increment,
   article_title        varchar(200),
   grade                int,
   term                 int,
   content              text,
   notes                varchar(256),
   created_user_id      int,
   created_at           datetime default CURRENT_TIMESTAMP,
   updated_at           datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted_at           datetime,
   primary key (article_id)
);

/*==============================================================*/
/* Table: m_new_words                                           */
/*==============================================================*/
create table m_new_words
(
   word_id              int not null auto_increment,
   word                 varchar(50),
   pinyin               varchar(50),
   grade                int,
   term                 int,
   article_id           int,
   notes                varchar(256),
   created_user_id      int,
   created_at           datetime default CURRENT_TIMESTAMP,
   updated_at           datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted_at           datetime,
   primary key (word_id)
);

