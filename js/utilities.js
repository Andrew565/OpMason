export function download_file(name, contents) {
  const mime_type = "text/json";
  var blob = new Blob([contents], { type: mime_type });

  var DownloadLink = document.createElement("a");
  DownloadLink.download = name;
  DownloadLink.href = window.URL.createObjectURL(blob);
  DownloadLink.onclick = (e) => {
    // revokeObjectURL needs a delay to work properly
    setTimeout(function () {
      window.URL.revokeObjectURL(DownloadLink.href);
    }, 1500);
  };

  DownloadLink.click();
  DownloadLink.remove();
}
