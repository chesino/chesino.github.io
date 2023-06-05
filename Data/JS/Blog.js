const rssUrl1 = 'https://hunqd.wordpress.com/feed';
const rssUrl2 = 'https://nglhunqd.wordpress.com/feed';
const proxyUrl = 'https://api.allorigins.win/raw?url=';

fetch(proxyUrl + encodeURIComponent(rssUrl1))
    .then(response => response.text())
    .then(str => new DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const items = data.querySelectorAll("item");

        let html = '';
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("encoded").textContent;

            const creator = item.querySelector("creator").textContent;
            const pubDate = item.querySelector("pubDate").textContent;
            const pubDateTimeStamp = Date.parse(pubDate);
            const nowTimeStamp = Date.now();
            const timeDiff = nowTimeStamp - pubDateTimeStamp;

            // Chuyển khoảng thời gian từ millisecond sang giây, phút, giờ hoặc ngày
            const secondDiff = Math.floor(timeDiff / 1000);
            const minuteDiff = Math.floor(timeDiff / (1000 * 60));
            const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            let TimeDiff = '';
            if (dayDiff > 0) {
                TimeDiff = dayDiff + " ngày trước";
            } else if (hourDiff > 0) {
                TimeDiff = hourDiff + " giờ trước";
            } else if (minuteDiff > 0) {
                TimeDiff = minuteDiff + " phút trước";
            } else {
                TimeDiff = "vừa xong";
            }

            html += `
    <div class="rss-item">
      <h1>${title}</h1>
      <p class="time"><b>${creator}</b> - ${TimeDiff}  </p>
      <p>${description} </p>
    </div>
  `;
//   <a href="${link}">Xem thêm</a>
        });

        document.querySelector('#rss-feed').innerHTML = html;
    })
    .catch(error => console.log(error));

fetch(proxyUrl + encodeURIComponent(rssUrl2))
    .then(response => response.text())
    .then(str => new DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const items = data.querySelectorAll("item");

        let html = '';
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("encoded").textContent;

            const creator = item.querySelector("creator").textContent;
            const pubDate = item.querySelector("pubDate").textContent;
            const pubDateTimeStamp = Date.parse(pubDate);
            const nowTimeStamp = Date.now();
            const timeDiff = nowTimeStamp - pubDateTimeStamp;

            // Chuyển khoảng thời gian từ millisecond sang giây, phút, giờ hoặc ngày
            const secondDiff = Math.floor(timeDiff / 1000);
            const minuteDiff = Math.floor(timeDiff / (1000 * 60));
            const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            let TimeDiff = '';
            if (dayDiff > 0) {
                TimeDiff = dayDiff + " ngày trước";
            } else if (hourDiff > 0) {
                TimeDiff = hourDiff + " giờ trước";
            } else if (minuteDiff > 0) {
                TimeDiff = minuteDiff + " phút trước";
            } else {
                TimeDiff = "vừa xong";
            }

            html += `
    <div class="rss-item">
      <h1>${title}</h1>
      <p class="time"><b>${creator}</b> - ${TimeDiff}  </p>
      <p>${description} </p>
   
    </div>
  `;
//   <a href="${link}">Xem thêm</a>
        });

        document.querySelector('#rss-ngl').innerHTML = html;
    })
    .catch(error => console.log(error));

