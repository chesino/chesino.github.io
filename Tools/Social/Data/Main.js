async function fetchPacks() {
    try {
        const response = await fetch('./Packs/Packs.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Hàm tạo HTML cho mỗi Card
function generateCardHTML(pack) {
    return `
      <div class="Card">
        <div class="image">
          <img src="${pack.ImagePack}" alt="${pack.PackName}">
        </div>
        <div class="product">
          <h1 class="name">${pack.PackName}</h1>
          <p class="description">${pack.Details.Description || `${pack.Details.Follow} Follow, ${pack.Details.Like || ''} Like`}</p>
        </div>
        <div class="buy">
            <p class="price">
                ${pack.OriginalPrice ? `<span class="priceroot">${pack.OriginalPrice}</span>` : ''}
                ${pack.DiscountedPrice || pack.Price}
            </p>

            <a href="${pack.Link}" target="_blank">
                <button>
                    <i class="fa-solid fa-plus"></i>
                </button>
            </a>
        </div>
      </div>
    `;
}
// Hàm render các Card vào HTML
function renderPacks(data, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = data.map(pack => generateCardHTML(pack)).join('');
   
}

// Tải JSON và render các thẻ
fetchPacks().then(data => {
    if (data) {
        renderPacks(data.PacksOne, "PacksOne");
        renderPacks(data.LikePacks, "LikePacks");
        renderPacks(data.FollowPacks, "FollowPacks");
    }
});