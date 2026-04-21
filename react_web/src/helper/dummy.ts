export const dummy_tags = ["javascript", "axios", "fetch", "redux"];

export const dummy_content = `<p>Welcome to TinyMCE!</p>
<pre class="language-javascript"><code>import React from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

function Highlight() {
  const highlightedCode = hljs.highlight("&lt;span&gt;const main=()=&gt;console.log('Hello')&lt;/span&gt;", {
    language: "javascript",
  }).value;

  console.log("--", highlightedCode);
  return &lt;div&gt;Highlight&lt;/div&gt;;
}

export default Highlight;
</code></pre>`;


export const dummy_news = [
  {
    "id": "05ab47f29ecf2d3223af79ba6b942c44",
    "title": "Samsung's Galaxy Z TriFold already sold out in South Korea ahead of US launch",
    "description": "Samsung’s long-awaited Galaxy Z TriFold will hit store shelves in the US early next year, but if its Korean launch...",
    "content": "Samsung’s long-awaited Galaxy Z TriFold will hit store shelves in the US early next year, but if its Korean launch cycle is any sign of things to come, don’t expect the device to stay in stock for very long.\nThe Galaxy Z TriFold launched in South Kor... [1622 chars]",
    "url": "https://9to5google.com/2025/12/12/samsungs-galaxy-z-trifold-already-sold-out-in-south-korea-ahead-of-us-launch/",
    "image": "https://i0.wp.com/9to5google.com/wp-content/uploads/sites/4/2025/12/galaxy-z-trifold-5.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1",
    "publishedAt": "2025-12-12T15:10:00Z",
    "lang": "en",
    "source": {
      "id": "193b7d40ab663e4d261c3f650b07dbbf",
      "name": "9to5Google",
      "url": "https://9to5google.com"
    }
  },
  {
    "id": "f4b0d4f324313c22b55ba1fcec841093",
    "title": "Bored with your Windows 11 desktop? Microsoft is offering a free upgrade of handpicked themes from its store",
    "description": "Microsoft's getting organized with its themes in the store",
    "content": "Microsoft has revealed a new feature for its store in Windows 11\nIt's a hub full of curated or trending themes to apply to the desktop\nThere are over 400 themes in total, including 35 new efforts\nMicrosoft wants to make it easier for you to swiftly p... [2664 chars]",
    "url": "https://www.techradar.com/computing/windows/bored-with-your-windows-11-desktop-microsoft-is-offering-a-free-upgrade-of-handpicked-themes-from-its-store",
    "image": "https://cdn.mos.cms.futurecdn.net/yDEQdr5DUC92FKqjXsZD8F-1920-80.jpeg",
    "publishedAt": "2025-12-12T15:00:00Z",
    "lang": "en",
    "source": {
      "id": "f884e22d91ed60e3f04d31d7bf217839",
      "name": "TechRadar",
      "url": "https://www.techradar.com"
    }
  },
  {
    "id": "08df27fd7a5f2bd55df593b0be77c0da",
    "title": "From Valentine’s Day to Philosophy: What people searched most on Microsoft Copilot in 2025",
    "description": "Tech News News: Microsoft's AI division analyzed 37.5 million Copilot conversations from 2025, revealing users treated it as a trusted advisor. Health queries dominat",
    "content": "Microsoft's AI division analyzed 37.5 million Copilot conversations from 2025, revealing users treated it as a trusted advisor. Health queries dominated mobile use, while programming and gaming interests peaked in August, with coding during weekdays ... [2331 chars]",
    "url": "https://timesofindia.indiatimes.com/technology/tech-news/from-valentines-day-to-philosophy-what-people-searched-most-on-microsoft-copilot-in-2025/articleshow/125935880.cms",
    "image": "https://static.toiimg.com/thumb/msid-125935878,width-1070,height-580,imgsize-125804,resizemode-75,overlay-toi_sw,pt-32,y_pad-500/photo.jpg",
    "publishedAt": "2025-12-12T14:57:00Z",
    "lang": "en",
    "source": {
      "id": "9c931d3332c3a87c89b804230892aa64",
      "name": "Times of India",
      "url": "https://timesofindia.indiatimes.com"
    }
  }
]

export const dummy_question = {
  question_id: 1,
  question: '<div>What is the output for <code style="background-color:#cecece">console.log("Hello")</code></div>',
  options: [
    {
      option_id: 1,
      value: 'hello',
      label: 'Hello'
    },
    {
      option_id: 2,
      value: 'hello',
      label: 'Hello'
    },
    {
      option_id: 3,
      value: 'hello',
      label: 'Hello'
    },
    {
      option_id: 4,
      value: 'hello',
      label: 'Hello'
    },

  ]
}