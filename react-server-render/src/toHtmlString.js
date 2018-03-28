const template = `
<html>
  <head>
    <title><!-- TITLE --></title>
    <!-- META -->
    <!-- LINK -->
    <!-- STYLESHEET -->
  </head>
  <body>
    <!-- HEADERHTML -->
    <div id="root"><!-- CONTENT --></div>
    <!-- FOOTERHTML -->
    <!-- JAVASCRIPT -->
  </body>
</html>
`;

export default (string = '') => template.replace('<!-- CONTENT -->', string);
