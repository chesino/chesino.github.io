function submitForm() {
  const type = document.getElementById("type").value;
  const logo = document.getElementById("logo").value;
  const name = document.getElementById("name").value;
  const os = document.getElementById("os").value;
  const version = document.getElementById("version").value; // Thêm dòng này
  const size = document.getElementById("size").value; // Thêm dòng này
  const description = document.getElementById("description").value;
  const downloadLinkValue = document.getElementById('downloadLink').value;

  // Chuyển đổi đường link nếu cần
  const convertedDownloadLink = convertToDownloadLink(downloadLinkValue);

  const data = {
    type: type,
    logo: logo,
    name: name,
    os: os,
    version: version, // Thêm dòng này
    size: size, // Thêm dòng này
    description: description,
    downloadLink: convertedDownloadLink
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(data, null, 2) + ',';

  setTimeout(() => {
    const typeValue = document.getElementById('type').value;
    const logoValue = document.getElementById('logo').value;
    const nameValue = document.getElementById('name').value;
    const osValue = document.getElementById('os').value;
    const versionValue = document.getElementById('version').value; // Thêm dòng này
    const sizeValue = document.getElementById('size').value; // Thêm dòng này
    const descriptionValue = document.getElementById('description').value;
    const downloadLinkValue = document.getElementById('downloadLink').value;

    // Chuyển đổi đường link nếu cần
    const convertedDownloadLink = convertToDownloadLink(downloadLinkValue);

    const data = {
      type: typeValue,
      logo: logoValue,
      name: nameValue,
      os: osValue,
      version: versionValue, // Thêm dòng này
      size: sizeValue, // Thêm dòng này
      description: descriptionValue,
      downloadLink: convertedDownloadLink,
    };

    const jsonData = JSON.stringify(data, null, 2) + ',';
    
    navigator.clipboard.writeText(jsonData);
  }, 100);
}

function convertToDownloadLink(viewLink) {
  // Kiểm tra xem đường link có chứa "/view?" hay không
  if (viewLink.includes("/view?")) {
    // Tách id từ đường link view
    const fileId = viewLink.split("/file/d/")[1].split("/view?")[0];

    // Tạo đường link download
    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return downloadLink;
  }

  // Nếu đường link không chứa "/view?", trả về nguyên bản
  return viewLink;
}

const copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener('click', () => {
  // Lấy các giá trị của các trường form
  const typeValue = document.getElementById('type').value;
  const logoValue = document.getElementById('logo').value;
  const nameValue = document.getElementById('name').value;
  const osValue = document.getElementById('os').value;
  const versionValue = document.getElementById('version').value; // Thêm dòng này
  const sizeValue = document.getElementById('size').value; // Thêm dòng này
  const descriptionValue = document.getElementById('description').value;
  const downloadLinkValue = document.getElementById('downloadLink').value;

  // Chuyển đổi đường link nếu cần
  const convertedDownloadLink = convertToDownloadLink(downloadLinkValue);

  const data = {
    type: typeValue,
    logo: logoValue,
    name: nameValue,
    os: osValue,
    version: versionValue, // Thêm dòng này
    size: sizeValue, // Thêm dòng này
    description: descriptionValue,
    downloadLink: convertedDownloadLink,
  };

  // Chuyển dữ liệu sang định dạng JSON và sao chép vào clipboard
  const jsonData = JSON.stringify(data, null, 2) + ',';
  navigator.clipboard.writeText(jsonData);
});
