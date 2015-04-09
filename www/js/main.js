$(document).ready(function () {
    var domain = 'http://193.46.86.147/';
    var user_id = '0a38acb7-21df-4cff-a650-1450d13450d8';
    var storybook_id = '6';
    
    error_message = [
        '<div style="font-size:30px; text-align: center;">Ooops! Something went wrong! <br> PLease try again later. </div>'
    ].join('');
    
    ratio = 0.5594405594405594;

    booklet_width = 640;
    booklet_height = 572;
    
    mobile = $(window).width() <= 739;
    mobile_controls = [
                '<div class="book-controls">',
                    '<button class="page-prev"></button>',
                    '<button class="page-next"></button>',
                '</div>'
        ].join('');
        
    $.smartbanner({
            title: "Today's Parent Milestones",
            author: 'Rogers Publishing Limited',
            icon: 'http://a1.mzstatic.com/us/r30/Purple6/v4/d2/30/40/d230403c-0fbe-608c-48e2-6072b7c4f1a0/icon175x175.png',
            price: 'FREE',
            daysHidden: 15,
            daysReminder: 90
        });
    
    $.ajax({
        url: "../api.php",
        dataType: "json",
        data: {
            domain: domain,
            path: '/users/' + user_id + '/flip_books/' + storybook_id + '/flip_book_pages'
        }
    }).done(function(data) {
        if (data.status === 'ok') {
            page_content = '';
            book_content = [];
            pages = [];

            $.each(data.data, function(i, data) {
                position = data.position + 1;
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
            });
            book_content.sort(sortPages);

            $(book_content).each(function(){
                pages.push(this.content);
            });
            if (mobile) {
                $(pages.join('')).appendTo("#storybook");
                $(mobile_controls).prependTo("#storybook");
            } else {
                $(pages.join('')).prependTo("#storybook");
            }
        } else {
            $("#storybook").html(error_message);
            $("#storybook").css('margin-left', '-160px');
        }
        
    }).complete(function() {
        if (mobile) {
            booklet_width = parseInt($(window).width() * 0.8);
            booklet_height = parseInt(booklet_width / ratio);
            
            flipPage();
        } else {
            booklet(booklet_width, booklet_height);
            $('.b-page-blank').parents('.b-page').addClass('back-cover');
            $('.b-page-blank').parents('.b-page').prev().addClass('last-page');
        }
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
            if ($('video').length !== 0) {
                if ($(data.pages).find('video').length !== 0) {
                    $(data.pages).find('video')[0].play();
                } else {
                    $('video')[0].pause();
                }
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

function flipPage() {
    var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
    page = 1;
    total_pages = $('.page').length;
    flipPageSize();
    $(window).resize(function(){
        flipPageSize();
    });
    $('#storybook').addClass('is-first-page');
    $('.page.last-page').css('display', 'block');
    
    if ($('.number-1 .cover video').length != 0) {
        $('.number-1 .cover video')[0].play();
    }
    
    // Controls
    $('.book-controls .page-next').click(function() {
        if (1 <= page && page < total_pages) {
            $('#storybook .number-' + page + '').addClass('has-turned');
            if (iOS) {
                $('#storybook .number-' + page + '').animateRotate(0, -90, 350, "linear", function() {
                    $('#storybook .number-' + (page - 1) + '').attr('style', '');
                }).css({transition: 'none', WebkitTransition: 'none', visibility: 'visible'});
            }
            page += 1;
            
            checkPages();
            checkMediaContent(-1);
        }
    });
    $('.book-controls .page-prev').click(function() {
        if (1 < page && page <= total_pages) {
            page -= 1;
            $('#storybook .number-' + page + '').removeClass('has-turned');
            if (iOS) {
                $('#storybook .number-' + page + '').animateRotate(-90, 0, 350, "linear", function() {
                    $('#storybook .number-' + page + '').attr('style', '');
                }).css({transition: 'none', WebkitTransition: 'none', visibility: 'visible'});
            }
            checkPages();
            checkMediaContent(1);
        }
    });
    
    function checkPages() {
        if (page >= 2) {
            $('#storybook').removeClass('is-first-page');
        } else {
            $('#storybook').addClass('is-first-page');
        }
        if (page == total_pages) {
            $('#storybook').addClass('is-last-page');
        } else {
            $('#storybook').removeClass('is-last-page');
        }
    }
    
    function checkMediaContent(op) {
        if ($('video').length !== 0) {
            if ($('.number-' + page + '.video video').length != 0 && !iOS) {
                $('.number-' + page + '.video video')[0].play();
            }
            if ($('.number-' + (page + op) + '.video video').length != 0) {
                $('.number-' + (page + op) + '.video video')[0].pause();
            }
        }
        if ($('audio').length !== 0) {
            if ($('.number-' + page + '.audio audio').length != 0 && !iOS) {
                $('.number-' + page + '.audio audio')[0].play();
            }
            if ($('.number-' + (page + op) + '.audio audio').length != 0) {
                $('.number-' + (page + op) + '.audio audio')[0].pause();
            }
        }
    }
    
    function flipPageSize() {
        booklet_width = $('#storybook').width();
        booklet_height = parseInt(booklet_width / ratio);
        $('#storybook').css({height: booklet_height});
    }
}

function sortPages(a,b) {
    if (mobile) {
        if (a.page > b.page)
            return -1;
        if (a.page < b.page)
            return 1;
        return 0;
    } else {
        if (a.page < b.page)
            return -1;
        if (a.page > b.page)
            return 1;
        return 0;
    }
}

$.fn.animateRotate = function(turn, angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function(i, e) {
        args.step = function(now) {
            $.style(e, 'transform', 'rotateY(' + now + 'deg)');
            if (step)
                return step.apply(this, arguments);
        };

        $({deg: turn}).animate({deg: angle}, args);
    });
};