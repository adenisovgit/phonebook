#!/usr/bin/env babel-node

import solution from '..';

const port = 8080;
solution(port, (...args) => console.log(...args));
