CREATE TABLE users {
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
}
