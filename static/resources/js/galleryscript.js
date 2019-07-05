var initPhotoSwipeFromDOM = function(gallerySelector) {

    var parseGallery = function(gallery) {
        var figures = gallery.getElementsByTagName('figure');
        var slides = [];

        for(var i = 0; i < figures.length; i++) {
            var figure = figures[i];
            var imgLink = figure.children[0];
            var size = imgLink.getAttribute('data-size').split('x');
            var slide = {
                src: imgLink.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figure.children.length > 1) {
                slide.title = figure.children[1].innerHTML; 
            }

            if(imgLink.children.length > 0) {
                slide.msrc = imgLink.children[0].getAttribute('src');
            } 

            slide.el = figure; // save link to element for getThumbBoundsFn
            slides.push(slide);
        }

        return slides;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        
        
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode.parentNode.parentNode,
            nodeIndex = 0,
            index;
        var figures = clickedGallery.getElementsByTagName('figure');

        for (var i = 0; i < figures.length; i++) {

            if(figures[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    var openPhotoSwipe = function(index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseGallery(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL

            options.index = parseInt(index, 10);


        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }


            options.showAnimationDuration = 0;
        options.hideAnimationDuration = 0;


        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
};

// execute above function

initPhotoSwipeFromDOM('.section-photos');