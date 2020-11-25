function getUrlsByPdf(url) {

  return new Promise((res, rej) => {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, true);
    httpRequest.responseType = "blob";
    httpRequest.onload = function (oEvent) {
      var response = httpRequest.response;
      var reader = new FileReader();
      reader.readAsDataURL(response); //将文件读取为 DataURL
      reader.onload = function (e) {
        pdfjsLib.getDocument(this.result).then(function (pdf) {
          // console.log(pdf)
          const numPages = pdf.numPages;
          const allPromise = [];
          for (let i = 1; i <= numPages; i++) {
            allPromise.push(pdf.getPage(i))
          }
          Promise.all(allPromise).then(fin => {
            finArr = []
            fin.forEach((p, i) => {
              var canvas = document.createElement('canvas');
              canvas.id = "pageNum" + i;
              // document.body.append(canvas);
              var context = canvas.getContext('2d');
              finArr.push(renderImg(p, context, canvas))
            });
            Promise.all(finArr).then(finarr => {
              res(finarr)
            })
          })
        })
      }
    }
    httpRequest.send();
  })
  
}

var renderImg = function (page, canvasContext, canvasdom) {
  return new Promise(reslove => {
    var viewport = page.getViewport({
      scale: 2,
    });

    var renderContext = {
      canvasContext: canvasContext,
      viewport: viewport
    };

    // page.render(renderContext); //渲染生成
    page.render(renderContext).promise.then(res => {
      var baseStr = canvasdom.toDataURL("image/png")
      // console.log(baseStr)
      reslove(baseStr)
    })
  })
  

}