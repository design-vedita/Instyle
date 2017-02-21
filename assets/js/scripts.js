jQuery(function($){
    let animDuration   = 400;
    let animInProgress = false;

    $('.js-link').click(function(event){
        event.preventDefault();
    });

    $('.js-link--anchor').click(function(){
        let target  = $(this).attr('href');
        let $target = $(target);

        $('html, body').animate({
            scrollTop: $target.offset().top
        }, 400);
    });

    $('.js-link--modal-close').click(function(){
        let modalID = '#' + $(this).parents('.modal').attr('id');

        $(modalID).modal('hide');
    });

    // Checkbox / Radio {
    $('.input-checkbox').click(function(){
        $(this).toggleClass('active');

        let $input = $(this).find('input');
        $input.prop('checked', !$input.prop('checked'));
    });
    $('.input-checkbox + .input-label').click(function(){
        $(this).prev('.input-checkbox').click();
    });

    $('.input-radio').click(function(){
        let $radioActive = $(this).parents('.input-radio-group').find('.input-radio.active');
        $radioActive.removeClass('active');
        $radioActive.find('input').removeProp('checked');

        $(this).addClass('active');
        $(this).find('input').prop('checked', 'checked');
    });
    $('.input-radio + .input-label').click(function(){
        $(this).prev('.input-radio').click();
    });
    // }

    /* Main page header slider { */
    $('.page-header--slider-nav-link_left').click(function(){
        let $slide     = $('.page-header--slider-item.active');
        let $slidePrev = $slide.prev();

        if (!$slidePrev.length) {
            $slidePrev = $('.page-header--slider-item:last-child');
        }

        $slide.fadeOut(function(){
            $slide.removeClass('active');
            $slidePrev.fadeIn(function(){
                $slidePrev.addClass('active');
            });
        });
    });
    $('.page-header--slider-nav-link_right').click(function(){
        let $slide     = $('.page-header--slider-item.active');
        let $slideNext = $slide.next();

        if (!$slideNext.length) {
            $slideNext = $('.page-header--slider-item:first-child');
        }

        $slide.fadeOut(function(){
            $slide.removeClass('active');
            $slideNext.fadeIn(function(){
                $slideNext.addClass('active');
            });
        });
    });
    /* } */

    /* Partners logos { */
    if ($('.titled-logos-list--slider-items').length) {
        $('.titled-logos-list--slider-items').slick({
            infinite:       true,
            slidesToShow:   5,
            slidesToScroll: 5,
            prevArrow:      $('.titled-logos-list--nav-link.titled-logos-list--nav-link_prev'),
            nextArrow:      $('.titled-logos-list--nav-link.titled-logos-list--nav-link_next')
        });
    }
    /* } */

    /* Animations { */
    $('.page-header--search').click(function(){
        $(this).find('input').focus();
    })
    $('.page-header--search input')
        .focus(function(){
            let $search = $(this).parent();

            let menuWidth = parseInt($search.prev().width()) + 'px';

            $search.animate({
                width: menuWidth,
                marginLeft: '-' + menuWidth,
                paddingLeft: '20px',
                paddingRight: '20px',
                backgroundColor: '#181818'
            });
        })
        .blur(function(){
            let $search = $(this).parent();

            $search.animate({
                width: '40px',
                marginLeft: '10px',
                paddingLeft: '10px',
                paddingRight: '0',
                backgroundColor: 'black'
            });
        });

    function setProductsZindexes() {
        jQuery.fn.reverse = [].reverse;

        $('.titled-productions-list').each(function(){
            let productZindex = 100;

            $(this).find('.titled-productions-list--item').reverse().each(function(){
                $(this).css('zIndex', productZindex++);
            });
        })
    }
    setProductsZindexes();

    $('.titled-productions-list--item')
        .mouseenter(function(){
            let $item = $(this);

            $item
              .addClass('hovered')
              .css({position: 'absolute'});
        })
        .mouseleave(function(){
            let $item = $(this);

            $item.removeClass('hovered');

            setTimeout(function(){
                if (!$item.hasClass('hovered')) {
                    $item.css({position: 'static'});
                }
            }, 420);
        });
    /* } */

    /* Shops map { */
    if ($('.shops-list--map').length) {
        let shopsMap = new google.maps.Map(document.getElementById('shops-map'), {
            center: {lat: 52.72204223500498, lng: 41.45635054964597},
            zoom: 13
        });

        let imgPath = $('#shops-map').data('img-path');
        let marks   = [];

        $('.shops-list--shop').each(function(){
            let $shop = $(this);
            let point = $shop.data('coords');

            if (!point) {
                // continue;
                return true;
            }

            let $parent   = $shop.parent();
            let imgName   = '';
            let imgSize   = [];
            let imgCenter = [];

            if ($parent.hasClass('shops-list--items_big')) {
                imgName = 'icon-shop-big-mark.png';
            } else if ($parent.hasClass('shops-list--items_small')) {
                imgName = 'icon-shop-small-mark.png';
            }

            let address = $shop.find('.shops-list--shop-data-item_address').text();

            let mark = new google.maps.Marker({
                position: {lat: point[0], lng: point[1]},
                icon: imgPath + imgName,
                map: shopsMap
            });
            mark.addListener('click', function() {
                $shop.find('.shops-list--shop-title').click();
            });

            marks.push(mark);
        });

        let bounds = new google.maps.LatLngBounds();

        marks.forEach(function(mark){
            bounds.extend(mark.getPosition());
        });

        shopsMap.fitBounds(bounds);
    }
    /* } */

    /* Shop modal { */
    let $shopModal = $('#shop-modal');
    let shopMap = null;

    if ($shopModal.length && $(window).width() >= 768) {
        $shopModal.modal({show: false});

        $shopModal.on('shown.bs.modal', function(){
            let mapCenter = shopMap.getCenter();
            google.maps.event.trigger(shopMap, 'resize');
            shopMap.setCenter(mapCenter);
            shopMap.setZoom(16);
        });

        $('.shops-list--shop-title').click(function(){
            let $shop = $(this).parents('.shops-list--shop');

            // Text data
            $shopModal.find('.shop-title').text(             $shop.find('.shops-list--shop-title').text()             );
            $shopModal.find('.shop-info-item_address').text( $shop.find('.shops-list--shop-data-item_address').text() );
            $shopModal.find('.shop-info-item_phone').text(   $shop.find('.shops-list--shop-data-item_phone').text()   );
            $shopModal.find('.shop-info-item_email').text(   $shop.find('.shops-list--shop-data-item_email').text()   );
            $shopModal.find('.shop-info-item_time').text(    $shop.find('.shops-list--shop-data-item_time').text()    );

            // Images
            let images = $shop.data('images');

            if (images.length) {
                $shopModal.find('.shop-gallery--img').html( $('<img src="'+images[0]+'" alt="">') );

                let $thumbs = $shopModal.find('.shop-gallery--thumbs');
                $thumbs.html('');

                images.forEach(function(item, i){
                    let activeClass = (i !== 0) ? '' : ' class="active"';
                    //$thumbs.append( $(`<a href="${item}"${activeClass}><img src="${item}" alt=""></a>`) );
                    //fucking IE11 don't support string interpolation T_T
                    $thumbs.append( $('<a href="'+item+'"'+activeClass+'><img src="'+item+'" alt=""></a>') );
                });
            }

            // Map
            if (shopMap !== null) {
                shopMap = null;
            }

            let coords = $shop.data('coords');

            if (coords.length === 2) {
                shopMap = new google.maps.Map(document.getElementById('shop-map'), {
                    center: {lat: coords[0], lng: coords[1]},
                    zoom: 16
                });

                let imgPath = $shopModal.find('#shop-map').data('img-path');
                let $parent = $shop.parent();

                if ($parent.hasClass('shops-list--items_big')) {
                    imgName = 'icon-shop-big-mark.png';
                } else if ($parent.hasClass('shops-list--items_small')) {
                    imgName = 'icon-shop-small-mark.png';
                }

                let mark = new google.maps.Marker({
                    position: {lat: coords[0], lng: coords[1]},
                    icon: imgPath + imgName,
                    map: shopMap
                });
                let info = new google.maps.InfoWindow({
                    content: $shop.find('.shops-list--shop-title').text()
                });
                mark.addListener('click', function() {
                    info.open(shopMap, mark);
                });

                let bounds = new google.maps.LatLngBounds();
                bounds.extend(mark.getPosition());
                shopMap.fitBounds(bounds);
            }

            // Modal is ready now
            $shopModal.modal('show');
        });
    }

    $shopModal.on('click', '.shop-gallery--thumbs a', function(event){
        event.preventDefault();

        let $link = $(this);
        let $img  = $shopModal.find('.shop-gallery--img img');

        if ($img.length) {
            $img.fadeOut(function(){
                $img.prop('src', $link.prop('href'));
                $img.fadeIn();

                $('.shop-gallery--thumbs a.active').removeClass('active');
                $link.addClass('active');
            });
        }
    });
    /* } */

    /* Collections gallery { */
    $('.single-product--gallery-thumbs a').click(function(){
        let $link = $(this);
        let $img  = $('.single-product--gallery-img img');

        $img.fadeOut(function(){
            $img.prop('src', $link.attr('href'));
            $img.fadeIn();

            $('.single-product--gallery-thumbs a.active').removeClass('active');
            $link.addClass('active');
        });
    });
    /* } */

    $('.collection-items--item-count-increase').click(function(){
        let $input = $(this).prev();
        let val    = parseInt($input.val());

        if (val < $input.data('max')) {
            $input.val(val + 1);
        }
    });
    $('.collection-items--item-count-decrease').click(function(){
        let $input = $(this).next();
        let val    = parseInt($input.val());

        if (val > 0) {
            $input.val(val - 1);
        }
    });
    $('.collection-items--item-attributes-expand').click(function(){
        $(this).toggleClass('active');
        $(this).parent().next().slideToggle();
    });


    let $downloadRegistrationModal = $('#download-registration-modal');

    if ($downloadRegistrationModal.length) {
        $downloadRegistrationModal.modal({show:false});

        $('.collection-items--item-download-blocked').click(function(){
            $downloadRegistrationModal.modal('show');
        });
    }

    let $addedToCartModal = $('#added-to-cart-modal');

    if ($addedToCartModal.length) {
        $addedToCartModal.modal({show:false});

        $('.collection-items--item-add-to-cart').click(function(){
            let $item = $(this).parents('.collection-items--item');

            $addedToCartModal.find('.cart-item--articul').text( $item.find('.collection-items--item-articul span').text() );
            $addedToCartModal.find('.cart-item--title').text(   $item.find('.collection-items--item-title').text()        );
            $addedToCartModal.find('.cart-item--count').text(   $item.find('.collection-items--item-count').text()        );
            $addedToCartModal.find('.cart-item--price').text(   $item.find('.collection-items--item-price-value').text()  );

            $addedToCartModal.modal('show');
        });
    }

    $('.collection-items--item-remove').click(function(){
        $(this).parents('tr').fadeOut(function(){
            $(this).remove();
        });
    });
});
