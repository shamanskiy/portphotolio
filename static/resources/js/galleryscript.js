var initPhotoSwipe = function(gallerySelector) {

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

    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }
        
        var clickedGallery = clickedListItem.parentNode.parentNode.parentNode;
        var nodeIndex = 0;
        var index;
        var figures = clickedGallery.getElementsByTagName('figure');

        for (var i = 0; i < figures.length; i++) {

            if(figures[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    var openPhotoSwipe = function(index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            slides;

        slides = parseGallery(galleryElement);

        options = {
            getThumbBoundsFn: function(index) {
                var thumbnail = slides[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };
        
        options.index = parseInt(index, 10);
        options.showAnimationDuration = 0;
        options.hideAnimationDuration = 0;

        gallery = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default,slides,options);
        gallery.init();
    };

    var galleryElements = document.querySelectorAll(gallerySelector);
    galleryElements[0].onclick = onThumbnailsClick;
};

initPhotoSwipe('.section-photos');