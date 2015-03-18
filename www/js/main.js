$(document).ready(function () {
    var domain = 'http://193.46.86.147/';
    var user_id = '0a38acb7-21df-4cff-a650-1450d13450d8';
    var storybook_id = '172';
    
    $.ajax({
        url: "../api.php",
        dataType: "json",
        data: {
            domain: domain,
            path: '/users/' + user_id + '/flip_books/' + storybook_id + '/flip_book_pages'
        }
    }).done(function(data) {
        page_content = '';
        $.each(data.data, function(i, data) {
            position = data.position;
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
            
            var media = '';
            if (data.image_url !== null && data.video_url === null) {
                media = '<img src="' + domain + data.image_url + '" alt="">';
            } else if (data.video_url !== null) {
                media = '<video type="' + data.video_multimedia_content_type + '" webkit-playsinline="" loop="" preload="" src="' + domain + data.video_url + '" style="width: 100%;"></video>';
            }
            var title = data.title !== '' ? '<h1 class="title">' + data.title + '</h1>' : '';
            var content = data.content !== '' ? '<p>' + data.content + '</p>' : '';
            
            page_content += [
                '<div class="page ' + page_type + '">',
                     media,
                    '<div class="text-content">',
                        title,
                        content,
                     '</div>',
                '</div>'
            ].join('');
        });
        console.log(position);
        $(page_content).appendTo("#storybook");
    }).complete(function() {
        $("#storybook").booklet({
            width: 640,
            height: 572,
            closed: true,
            pageNumbers: false,
            arrows: true,
            pagePadding: 0,
            next: '#next',
            prev: '#prev',
            change: function(event, data) {
                if ($(data.pages).hasClass('video')) {
                    $(this).find('video')[0].play();
                } else {
                    $('.video video')[0].pause();
                }
            }
        });
        $('.b-page-blank').parents('.b-page').addClass('back-cover');
        $('.b-page-blank').parents('.b-page').prev().addClass('last-page');
    });
});