module.exports.homePage = function({csrfToken}) {
  const fileUpload = `
    <h1>Files Upload</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="hidden" name="_csrf" value="${csrfToken}"/>
        <input type="file" name="upload" />
        <button>upload</submit>
    </form>
  `;

  return `
    <!doctype html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Demo App</title>
    </head>
      <body>
        ${fileUpload}
      </body>
    </head>
  `;
};