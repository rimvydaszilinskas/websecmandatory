drop database if exists kea_websec;
create database kea_websec;

use kea_websec;

drop table if exists users;
create table users(
	id integer auto_increment primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    username varchar(50) not null,
    email varchar(100) not null,
    password varchar(255) not null,
    isAdmin bool default false
);

drop table if exists posts;
create table posts(
	id integer auto_increment primary key,
    post text not null,
    user_id integer not null,
    created_at timestamp not null default current_timestamp,
    foreign key (user_id) references users(id) on delete cascade
);

drop table if exists comments;
create table comments(
	id integer auto_increment primary key,
    post_id integer not null,
    user_id integer not null,
    comment text not null,
    created_at timestamp not null default current_timestamp,
	
    foreign key (user_id) references users(id) on delete cascade,
    foreign key (post_id) references posts(id) on delete cascade
);

-- grant all privileges on kea_websec.* to "kea"@"%" with grant option;