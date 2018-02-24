function doGet() {
  var t = HtmlService.createTemplateFromFile('index');
  return t.evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Single Page Web App');
}
 
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}