$().ready(function(){
    function DetailViewModel(){
        self = this;
        this.myemail = ko.observable();
        this.message = ko.observable();
        this.commentContent = ko.observable();
        this.submitComment = function () {
            $.ajax({
                type: "POST",
                data: JSON.stringify({
                    content: this.commentContent(),
                    rid: document.getElementById('comment-rid').value
                }),
                url: "/information/submitComment",
                contentType:'application/json',
                success: function(result) {
                    window.location.href = "./"+document.getElementById('comment-rid').value;
                },
                error: function(result) {
                    alert("connection error");
                }
            });
        };
    }
    ko.applyBindings(new DetailViewModel());

});