$().ready(function(){
    function InfoViewModel(){
        self = this;
        this.data = ko.observable();
        this.title = ko.observable("");
        this.location = ko.observable("");
        this.postdate = ko.observable("");
        this.description = ko.observable("");
        this.image = "";
        this.url = ko.observable("");

        this.submitEvent = function () {
            $.ajax({
                type: "POST",
                data: JSON.stringify({
                    title: this.title(),
                    location: this.location(),
                    postdate: this.postdate(),
                    description: this.description(),
                    image: this.image
                }),
                url: "/information/submitEvent",
                contentType:'application/json',
                success: function(result){
                    alert(result);
                },
                error: function(result) {
                    alert("connection error");
                }
            });
        };
        
        
        $.ajax({
            type: "GET",
            url: "/information/loadData",
            contentType:'application/json',
            
            success: function(result) {
                self.data(result);
            },
            error: function(result) {
                self.signupErrorMsg("connection error");
            }
        });
        
        

       
        if(document.getElementById('upinfo-body-upimg')) {
            document.getElementById('upinfo-body-upimg').onchange = function () {
                var file = document.getElementById('upinfo-body-upimg').files[0];
                if (file) {
                    var xhr = new XMLHttpRequest();
                    var fd = new FormData(document.getElementById('upinfo-body-upimg-form'));
                    xhr.addEventListener("load", function () {
                        $('.upinfo-body-upimg').css('background-image', 'url(/img/' + file.name + ')');
                        self.image = '/img/' + file.name;
                    }, false);
                    document.getElementById('movediv').style.display='none';
                    xhr.open("POST", "/information/upImage");
                    xhr.send(fd);
                }
            };
        }
    }
  
    ko.applyBindings(new InfoViewModel());

});