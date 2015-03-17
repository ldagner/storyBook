$(document).ready(function () {
    var domain = 'http://193.46.86.147/';
    
    $.ajax({
        url: "../api.php",
        dataType: "json",
        data: {
            domain: domain,
            path: '/users/0a38acb7-21df-4cff-a650-1450d13450d8/flip_books/172/flip_book_pages'
        }
    }).done(function(data) {
        $.each(data.data, function(i, data) {
            switch(data.page_type ) {
                case 0:
                    page_type = "cover";
                    break;
                case 1:
                    page_type = "full-image";
                    break;
                case 2:
                    page_type = "square-image";
                    break;
                case 3:
                    page_type = "round-image";
                    break;
                case 4:
                    page_type = "video";
                    break;
                case 5:
                    page_type = "quote";
                    break;
            }
            
            var img = data.image_url != null ? '<img src="' + domain + data.image_url + '" alt="">' : '';
            var page_content = [
                '<div class="page ' + page_type + '">',
                     img,
                '    <p>This domain is established to be used for illustrative examples in documents. You may use this',
                '    domain in examples without prior coordination or asking for permission.</p>',
                '    <p><a href="http://www.iana.org/domains/example">More information...</a></p>',
                '</div>'
            ].join('');
            
            $(page_content).appendTo("#storybook");
        });
    }).complete(function() {
        $("#storybook").booklet({
            width: 640,
            height: 572,
            closed: true,
            pageNumbers: false,
            arrows: true,
            pagePadding: 0,
            next: '#next',
            prev: '#prev'
        });
    });
});




$('.b-page-blank').parents('.b-page').addClass('last-page');
$('.b-page-blank').parents('.b-page').prev().addClass('last-page-2');