
function darkmode() {
    var element = document.body;
    element.classList.toggle("darkmode");
 }

function openMenu() {
    document.getElementById("mySidebar").style.width = "50%";
    document.getElementById("menu").style.marginLeft = "50%";
    
  }
  
function closeMenu() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("menu").style.marginLeft= "0";;
  }

window.onscroll = function() {BarScroll()};

function BarScroll() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }




  moveOnMax =function (field, nextFieldID) {
    if (field.value.length == 1) {
        document.getElementById(nextFieldID).focus();
    }
}


function openPage() {
  var x = document.getElementById("search").value;

  if (x === "300801") {
      window.open("/300801.html");
  }



  if (x === "HUY123") {
    window.open("/gif001.html");
}
  

}

function server2() {
  alert("Máy chủ không hoạt động");
}

function servervip() {
  if (window.confirm('Máy chủ hoạt động ổn định. \nDịch vụ: 15/15 \nNhấn "OK" để mua thành viên trả phí')) 
{
window.location.href='https://m.me/hunqD';
};
}

function ChangeSize(obj) {
  document.getElementById("p_content").className = obj.value;
}

function show1() {
  var x = document.getElementById("hp1");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function show2() {
      var x = document.getElementById("hp2");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
 


function show3() {
  var x = document.getElementById("hp3");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function show4() {
  var x = document.getElementById("hp4");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function show5() {
  var x = document.getElementById("hp5");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function show6() {
  var x = document.getElementById("hp6");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function show7() {
  var x = document.getElementById("hp7");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

