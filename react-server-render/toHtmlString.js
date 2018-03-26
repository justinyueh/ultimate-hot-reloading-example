const template = `
<html>
  <head>
    <title>Sample App</title>
    <!-- STYLESHEET -->
  </head>
  <body>
    <div id="root"><!-- CONTENT --></div>
    <script type="text/javascript">
      window.preloadState = "-- STORES --";
    </script>
    <!-- JAVASCRIPT -->
  </body>
</html>
`;

export default (string = '', stateObject) => template.replace('<!-- CONTENT -->', string)
  .replace('"-- STORES --"', JSON.stringify(stateObject));
