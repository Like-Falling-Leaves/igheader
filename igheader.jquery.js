//
// jQuery plugin for IG-style fixed header bar
// The structure is:
// <div>...
//   <div class="bar"></div>
//   <div class="section">
//    <div class="header">..</div>
//   </div>
// </div>
//
// This module clones the header and moves it to the 'bar' as needed.
// No Styles are added here, look at examples to style headers.
//

;(function () {
  var $ = window.jQuery || window.$;
  $(function () {
    addPlugin();
    $('.igheader').igheader();
  });

  function addPlugin() {
    $.fn.igheader = function (options) {
      this.each(function () {
        var data = $(this).data('igheader');
        if (data) {
          if (options == 'destroy') {
            $(this).data('igheader', null);
            $(this).off('.igheader').find('.bar').empty();
            return;
          }
          return $(this).trigger('igheader-update');
        } else {
          if (options == 'destroy') return;
          $(this).data('igheader', {});
          setupHeader(this);
        }
      });
      return this;
    };
  }

  function setupHeader(elt) { 
    var lastHeader = null, counter = 100;
    var lastTopMargin = 0;
    var headers;
    
    var bar = $(
      $(elt).find('.bar')[0] || $('<div>', {'class': 'bar'}).appendTo($(elt))
    );
    
    updateHeaders(); updateBarInfo();
    $(window).on('scroll', updateBarInfo);
    $(document).on('touchmove', false);
    if (window.Hammer) {
      var mc = new Hammer($(elt)[0], {pan: true, drag: true});
      var delta = 0;
      mc.on('panup pandown dragup dragdown', function (ev) {
        var deltaY = ('deltaY' in ev) ? ev.deltaY : (ev.gesture && ev.gesture.deltaY || 0);
        $(elt).scrollTop($(elt).scrollTop() - deltaY + delta);
        delta = deltaY;
        updateBarInfo();
      }).on('panend dragend', function () { delta = 0; });
    }
    return $(elt).on('igheader-update.igheader', function () { updateHeaders(); updateBarInfo(); })
      .on('igheader-scroll.igheader', updateBarInfo)
      .on('scroll.igheader', updateBarInfo);

    function findCurrentElt(start) {
      var top = $(elt).find('.bar')[0].getBoundingClientRect().top;
      var candidate = null;
      var index = start && headers.index(start) || 0;
      while (1) {
        if (index < 0) return null;
        
        var elt2 = headers.get(index);
        if (!elt2) return candidate;
        
        var rect = elt2.getBoundingClientRect();
        if (rect.top > top) {
          if (candidate) return candidate; 
          index --;
        } else {
          if (rect.bottom > top) return {elt: $(elt2), rect: rect, index: index};
          candidate = {elt: $(elt2), index: index, rect: rect};
          index ++;
        }
      }
    }
    
    function updateBarInfo() {
      var top = $(elt).find('.bar')[0].getBoundingClientRect().top;
      var found = findCurrentElt(lastHeader);
      if (!found) {
        lastHeader = null;
        lastTopMargin = 0;
        bar.empty();
        return;
      }
      
      var newHeight = found.rect.height, newTopMargin = 0;
      var nextHeader = $(headers.get(found.index + 1));
      if (nextHeader.length) {
        var rect = nextHeader[0].getBoundingClientRect();
        if (rect.top < (top + newHeight)) newTopMargin = rect.top - newHeight - top; 
      }
      
      if (found.elt[0] != lastHeader) {
        lastHeader = found.elt[0];
        bar.empty().append(found.elt.clone());
        lastTopMargin = 0;
      }
      
      if (lastTopMargin != newTopMargin) bar.find('.header').css({marginTop: newTopMargin});
      lastTopMargin = newTopMargin;
    }
    
    function updateHeaders() { headers = getHeaders(); }
    function getHeaders() {
      var barElt = $(bar).find('.header')[0];
      return $($(elt).find('.header:visible').filter(function (index) {return (this !== barElt); }));
    }
  }
})();

