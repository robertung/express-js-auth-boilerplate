CREATE TABLE expressboiler.users(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id)
);

CREATE TABLE expressboiler.users_info(
  id INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(255),
  zip INT,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
);

CREATE TABLE expressboiler.tokens(
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX (token)
);
