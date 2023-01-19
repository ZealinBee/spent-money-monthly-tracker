const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("./models/user");
const Token = require("./models/mailtoken");
const refreshTokenModel = require("./models/refreshtoken");
const crypt = require("./cryptography");
const auth = require("./service/authentication");
const mailer = require("./mail.js");
const router = express.Router();

token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InpoaXl1YW4ubGl1MDIzQGdtYWlsLmNvbSIsImlhdCI6MTY3Mzg3MzI2OX0.QzkldfujbVEMShUop2FKwgxCBnBKvhkQXehU9gTJcAE"

tokenelem={
    _id: "63c546a1a01c7a59884d3eb8",
    email: 'zhiyuan.liu023@gmail.com',
    _id: "63c547750520c23788b461d6",
    email: 'zhiyuan.liu023@gmail.com',
    token1: '$2a$10$HEtH5/2biCmAzgPeGM13CexFJb7p4a63Grs17RSaQCkmmVGorcC6u',
    token2: '$2a$10$HEtH5/2biCmAzgPeGM13Ceel/NcqeIZHl5laJDFjL9pJddbSc0UVm',
    token3: '$2a$10$HEtH5/2biCmAzgPeGM13CeZYeh7ga.srvs4lEBXThAgIpy3WhIiKO',
    line: 8,
    expired: false}
console.log(bcrypt.compareSync(token.slice(0,50),tokenelem.token1))&&(bcrypt.compareSync(token.slice(50,100),tokenelem.token2))&&(bcrypt.compareSync(token.slice(100,token.length),tokenelem.token3))
      