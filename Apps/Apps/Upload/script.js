function submitForm() {
    const type = document.getElementById("type").value;
    const logo = document.getElementById("logo").value;
    const name = document.getElementById("name").value;
    const os = document.getElementById("os").value;
    const description = document.getElementById("description").value;
    const downloadLink = document.getElementById("downloadLink").value;

    const data = {
        type: type,
        logo: logo,
        name: name,
        os: os,
        description: description,
        downloadLink: downloadLink
    };

    const output = document.getElementById("output");
    output.textContent = JSON.stringify(data, null, 2);

    setTimeout(() => {
       // Lấy các giá trị của các trường form
  const typeValue = document.getElementById('type').value;
  const logoValue = document.getElementById('logo').value;
  const nameValue = document.getElementById('name').value;
  const osValue = document.getElementById('os').value;
  const descriptionValue = document.getElementById('description').value;
  const downloadLinkValue = document.getElementById('downloadLink').value;

  // Tạo dữ liệu định dạng JSON từ các giá trị đã lấy được
  const data = {
    type: typeValue,
    logo: logoValue,
    name: nameValue,
    os: osValue,
    description: descriptionValue,
    downloadLink: downloadLinkValue
  };

  // Chuyển dữ liệu sang định dạng JSON và sao chép vào clipboard
  const jsonData = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(jsonData);
    }, 100);
}
const copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener('click', () => {
  // Lấy các giá trị của các trường form
  const typeValue = document.getElementById('type').value;
  const logoValue = document.getElementById('logo').value;
  const nameValue = document.getElementById('name').value;
  const osValue = document.getElementById('os').value;
  const descriptionValue = document.getElementById('description').value;
  const downloadLinkValue = document.getElementById('downloadLink').value;

  // Tạo dữ liệu định dạng JSON từ các giá trị đã lấy được
  const data = {
    type: typeValue,
    logo: logoValue,
    name: nameValue,
    os: osValue,
    description: descriptionValue,
    downloadLink: downloadLinkValue
  };

  // Chuyển dữ liệu sang định dạng JSON và sao chép vào clipboard
  const jsonData = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(jsonData);
});
