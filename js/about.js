
const placeCommonParts = new Promise ((resolve, reject) => {
  let xhr = new XMLHttpRequest(),
      method = "GET",
      url = "/common.html";
  let box = document.getElementById("common-header"),
      box2 = document.getElementById("bottom-nav"),
      box3 = document.getElementsByTagName("footer")[0];

  xhr.responseType = "document";
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let restxt = xhr.responseXML;
      let int = restxt.getElementsByTagName("header")[0],
          int2 = restxt.getElementsByTagName("nav")[0],
          int3 = restxt.getElementsByTagName("footer")[0];
      box.outerHTML = int.outerHTML;
      //box2.outerHTML = int2.outerHTML;
      box3.outerHTML = int3.outerHTML;

      const script = document.createElement('script')
      script.src = '/js/common-header.js'
      document.head.appendChild(script)
      resolve();
    }
  }

  xhr.send();
});

const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      (storage && storage.length !== 0);
  }
}

const languageEvent = () => {
  const $fieldset = document.querySelector("#sticky-header fieldset");
  if(storageAvailable('localStorage') && localStorage.getItem("lang")) {
    if(localStorage.getItem("lang") == "en") {
      document.getElementById("en").checked = true;

      document.getElementById('head1').innerText = "About";
      document.getElementById('head2').innerText = "Theme";
      document.getElementById('head3').innerText = "Message from the representative";
      document.getElementById('h1-1').innerText = 'Wasedasai is NOT only the festival in Waseda!';
      document.getElementById('h1-2').innerText = 'The science and engineering festival held at Nishiwaseda Campus at the beginning of every November';
      document.getElementById('h1-3').innerText = 'is "Rikoten".';
      document.getElementById('h1-4').innerText = 'Wasedasai is NOT only the festival in Waseda!';
      document.getElementById('h1-5').innerText = 'The science and engineering festival held at Nishiwaseda Campus at the beginning of every November';
      document.getElementById('h1-6').innerText = 'is "Rikoten".';
      document.getElementById('h1-7').innerText = 'Decided to hold "Rikoten" online';
      document.getElementById('h1-8').innerText = 'However, due to the spread of the new coronavirus infection this year, we have decided to abandon the event in the field. Therefore, after repeated negotiations with the university side, the 67th Rikoten is scheduled to be held on November 7th (Sat) and 8th (Sun), which was originally planned, as an "online holding" at the website and "Virtual Rikoten" application. It was decided to hold.';
      document.getElementById('h1-9').innerText = 'Co-starring science and school festival';
      document.getElementById('h1-10').innerText = 'As in the previous year, we are preparing a wide range of projects this year, from research presentations and lectures to visitor-participation-type experimental experience projects. We aim for everyone to see, feel, and enjoy various aspects of science. And of course, do not forget that "Rikoten" is a school festival! Expressing the liveliness and power of Waseda through stage performances is one of the important missions of "Rikoten".';
      document.getElementById('h1-11').innerText = 'This year, you can experience the atmosphere of "Rikoten" held in the field wherever you are with articles, pre-recorded videos, live distribution and Zoom! In addition, you can enjoy planning while walking in the Nishi-Waseda Campus with "Virtual Rikoten" app.';
      document.getElementById('h1-12').innerText = 'A special place where the academic atmosphere and the passion of Waseda students intersect for only two days. We can only interact with you through the screen, but we hope that as many people as possible will enjoy "Magic Hour" at the 67th Rikoten.';
      document.getElementById('h2-1').innerText = 'A world surrounded by magic';
      document.getElementById('h2-2').innerText = 'A world surrounded by magic';
      document.getElementById('h2-3').innerText = 'This theme has two meanings.';
      document.getElementById('h2-4').innerText = 'We want visitors to spend "magical time" by dyeing the science and engineering campus with a magical world view, and the sky blue at dusk changes for only a few tens of minutes, at a time when the world looks most beautiful. I would like you to experience a Magic Hour as a special time for only two days in a year.';
      document.getElementById('h2-5').innerText = 'Please come and experience the magical world.';
      document.getElementById('h3-1').innerText = 'Hello. My name is Shuntaro Funasaka, the representative of the Rikoten Executive Committee. Every year, as many as 20,000 visitors at "Rikoten" excited the campus and created the excitement of the school festival. Unfortunately, it is not possible to come directly to the campus and enjoy "Rikoten" this year. However, in such a situation, I thought that there should be something that a new "Rikoten" created from scratch could be delivered to everyone, so I set up a place called "Online Rikoten".';
      document.getElementById('h3-2').innerText = 'No matter what the situation, all the staff will do their best to deliver the passion and academicity of the leading role in science and engineering. And more than that, I sincerely hope that it will be an online school festival that will make you look forward to more time to enjoy "Rikoten" on campus with you. Last but not least, we have received the understanding and cooperation of many people in holding the new "Rikoten". We would like to express our sincere gratitude.';
      document.getElementById('h3-3').innerHTML = 'Rikoten Executive Committee 67th representative<br>Shuntaro Funasaka';
    }
  }


  $fieldset.onchange = function(){
    const language = document.querySelector("#sticky-header :checked").value;

    if(language == "en") {
      if (storageAvailable('localStorage')) {
        localStorage.setItem('lang', "en");
      }
    } else {
      if (storageAvailable('localStorage')) {
        localStorage.setItem('lang', "ja");
      }
    }

    location.reload();
  }
}

placeCommonParts.then(() => {
  languageEvent();
});