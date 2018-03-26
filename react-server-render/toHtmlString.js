const template = `
<html>
  <head>
    <title>Sample App</title>
    <!-- STYLESHEET -->
  </head>
  <body>
    <div id="root"><!-- CONTENT --></div>
    <!-- JAVASCRIPT -->
  </body>
</html>
`;

export default (string = '') => template.replace('<!-- CONTENT -->', string);
