$(document).ready(function () {
    ratio = 1.118881118881119;
    
    booklet_width = 640;
    booklet_height = 572;
    
    if ($(window).width() <= 739) {
        booklet_width = $(window).width();
        booklet_height = parseInt(booklet_width / ratio);
    }
    
    $.smartbanner({
            title: "Today's Parent Milestones",
            author: 'Rogers Publishing Limited',
            icon: 'http://a1.mzstatic.com/us/r30/Purple6/v4/d2/30/40/d230403c-0fbe-608c-48e2-6072b7c4f1a0/icon175x175.png',
            price: 'FREE',
            daysHidden: 15,
            daysReminder: 90
        });
    
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
        book_content = [];
        pages = [];
        
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
                media = '<video type="' + data.video_multimedia_content_type + '" webkit-playsinline="" loop="" preload="" src="' + domain + data.video_url + '"></video>';
            }
            var title = data.title !== '' ? '<h1 class="title">' + data.title + '</h1>' : '';
            var content = data.content !== '' ? '<p>' + data.content + '</p>' : '';
            
            page_content = [
                '<div class="page number-' + position + ' ' + page_type + '">',
                     media,
                    '<div class="text-content">',
                        title,
                        content,
                     '</div>',
                '</div>'
            ].join('');
            
            book_content.push({
                page: position,
                content: page_content
            });
            book_content.sort(function (a,b) {
                return a.page > b.page;   
            });
        });
        
        $(book_content).each(function(){
            pages.push(this.content);
        });
        $(pages.join('')).prependTo("#storybook");
        
    }).complete(function() {
        booklet(booklet_width, booklet_height);
        $('.b-page-blank').parents('.b-page').addClass('back-cover');
        $('.b-page-blank').parents('.b-page').prev().addClass('last-page');
    });
});

function booklet(w, h) {
    $("#storybook").booklet({
        width: w,
        height: h,
        closed: true,
        pageNumbers: false,
        arrows: true,
        pagePadding: 0,
        hoverWidth: 0,
        next: '#next',
        prev: '#prev',
        change: function(event, data) {
            if ($(data.pages).find('video').length !== 0) {
                $(data.pages).find('video')[0].play();
            } else {
                $('video')[0].pause();
            }
        }
    });
    
    var videos = [];
    videos = $('video');
    $('html').one('click', function() {
        for (i=0; i < videos.length; i++) {
            videos[i].play();
        }
        setTimeout(function(){
            for (i=0; i < videos.length; i++) {
                videos[i].pause();
            }
        }, 10);
    });
}