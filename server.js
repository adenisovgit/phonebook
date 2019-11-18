import http from 'http';
import url from 'url';
import querystring from 'querystring';

export default (usersById) => http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err.stack);
  });
  request.on('end', () => {
    if (request.url === '/') {
      const messages = [
        'Welcome to The Phonebook',
        `Records count: ${Object.keys(usersById).length}`,
      ];
      response.end(messages.join('\n'));
    } else if (request.url.startsWith('/search.json')) {
      response.setHeader('Content-Type', 'application/json');
      const { query } = url.parse(request.url);
      const { q } = querystring.parse(query);
      const normalizedSearch = q ? q.trim().toLowerCase() : '';
      const result = Object.values(usersById)
        .filter((user) => user.name.toLowerCase().includes(normalizedSearch));
      response.end(JSON.stringify(result));
    } else if (request.url.startsWith('/users.json')) {
      // BEGIN (write your solution here)
      response.setHeader('Content-Type', 'application/json');
      const { query } = url.parse(request.url);
      const { page: p, perPage: pP } = querystring.parse(query);
      const defaultPage = 1;
      const defaultPerPage = 10;
      const page = p ? Number(p) : defaultPage;
      const perPage = pP ? Number(pP) : defaultPerPage;
      const list = Object.values(usersById);
      const totalPages = Math.floor(list.length / perPage);
      const startingElement = (page - 1) * perPage;
      console.log(page, perPage, totalPages, startingElement, startingElement + perPage);
      const result = ({
        'meta': { page, perPage, totalPages },
        'data': list
          .slice(startingElement, startingElement + perPage)
          .map((el) => ({ 'name': el.name, 'phone': el.phone }))
      });
      console.log(result);
      response.end(JSON.stringify(result));
      // END
    }
  });
  request.resume();
});
