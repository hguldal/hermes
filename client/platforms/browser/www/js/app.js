var app_name="Hermes";
var botServer="https://klasorx.com";
$.support.cors=true;
var f7 = new Framework7({
    theme: 'ios',
    el: '#app',
    name: app_name,
    id: 'com.hermes.test',
    panel: {
      swipe: true,
    }
   
  });

var $$ = Dom7;

var mainView = f7.views.create('.view-main', {
    routes: [
      {
        path: '/login/',
        url: 'login.html',
      },
      {
        path: '/chat/',
        url: 'chat.html',
      },
      {
        path: '/intro/',
        url: 'intro.html',
      }
    ],
  });

var app = {
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);   
    },

    onDeviceReady: function() {
       
      init_hermes();
                 
    },

    receivedEvent: function(id) {

    } 
};
app.initialize();


function Linkify(inputText) {
  var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" style="color:blue" class="link external">Buraya tıklarmısın</a>');
  var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" style="color:blue" target="_blank" class="link external"><br>Buraya tıklarmısın</a>');
  var replacePattern3 = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
  var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">Link</a>');
  return replacedText
}

function Linkify2(inputText) {
  var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
  var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
  var replacePattern3 = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
  var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
  return replacedText
}


function init_hermes()
{
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
  var accessCode=localStorage.getItem("accessCode");

  if (!token)
  {
    mainView.router.navigate({url:'/login/',animate: true});
  }
  else
  {
    
    mainView.router.navigate({url:'/intro/',animate: true});
    
  }


}

$$(document).on('page:init', '.page[data-name="intro"]', function (e) {

  $$('#btnDevam').click(function()
  {
    f7.preloader.show();
    var token = localStorage.getItem("token");
    $.ajax(botServer + '/question', 
    {
      type: 'POST',
      contentType: "application/json",
      data: JSON.stringify({question:'test'}),
      headers: {
        'Authorization': 'Bearer ' + token
      },
      
      success: function (data,status,xhr) {
        f7.preloader.hide();
        mainView.router.navigate({url:'/chat/',animate: true});
      },
      error: function (jqXhr, textStatus, errorMessage) {  
        
        
          localStorage.setItem('token','');
          
          //yeni token iste
          $.ajax(botServer + '/refresh', 
          {
            type: 'POST',
            contentType: "application/json",
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("refreshToken")
            },
            success: function (data,status,xhr) { 
            
              localStorage.setItem('token',data.access_token);
              f7.preloader.hide();
              mainView.router.navigate({url:'/chat/',animate: true});
            },
            error: function (jqXhr, textStatus, errorMessage) {  
              f7.preloader.hide();
              f7.dialog.alert(errorMessage);
            }
        });
  
      }
  });


  });
  

});

function login()
{

  $.ajax(botServer + '/login', 
  {
    type: 'POST',
    contentType: "application/json",
    data: JSON.stringify({AccessCode:$('#accessCode').val()}),
    
    success: function (data,status,xhr) { 
     
      if (data.msg=='Incorrect code')
      {
        f7.dialog.alert('Girdiğin kod hatalıydı');
        return; 
      }

      localStorage.setItem('refreshToken',data.refresh_token);
      localStorage.setItem('token',data.access_token);
      mainView.router.navigate({url:'/intro/',animate: true});
      
    },
    error: function (jqXhr, textStatus, errorMessage) {  
      f7.dialog.alert(errorMessage);
    }
});
}

$$(document).on('page:init', '.page[data-name="chat"]', function (e) {
  var mesajlar = f7.messages.create({
    el: '.messages',
    autoLayout:true,
    scrollMessages:true
    });
  
  var mesajBar = f7.messagebar.create({
      el: '.messagebar'
    });
  

  $$('#lnkSend').click(function(){
        var soru = Linkify(mesajBar.getValue().trim());
        var token = localStorage.getItem("token");
    
        //Token süresi geçmişse kullanılacak
        var refreshToken = localStorage.getItem("refreshToken");
        var msgSoru = {
          text: soru,
          type:'sent',
          name:'Sen'
        }
        mesajlar.addMessage(msgSoru);

        mesajlar.showTyping({
          header: app_name  + ' yaziyor...'
        });
        
        $.ajax(botServer + '/question', 
        {
          type: 'POST',
          contentType: "application/json",
          data: JSON.stringify({question:soru}),
  
          headers: {
            'Authorization': 'Bearer ' + token
          },
          
          success: function (data,status,xhr) {

            mesajlar.hideTyping();
            
            var yanit = {
              text: Linkify(data.answer.text),
              type:'received',
              imageSrc:data.answer.image_url,
              name:app_name
            }
            mesajlar.addMessage(yanit);
            mesajBar.clear();
            mesajBar.focus();
          },
          error: function (jqXhr, textStatus, errorMessage) {  
            
            
              localStorage.setItem('token','');
              
              //yeni token iste
              $.ajax(botServer + '/refresh', 
              {
                type: 'POST',
                contentType: "application/json",
                headers: {
                  'Authorization': 'Bearer ' + refreshToken
                },
                success: function (data,status,xhr) { 
                
                  localStorage.setItem('token',data.access_token);
                },
                error: function (jqXhr, textStatus, errorMessage) {  
                  f7.dialog.alert(errorMessage);
                }
            });
      
          }
      });
        
        
        
        
  });
  

  
  
  
});

