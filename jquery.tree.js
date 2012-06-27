// Require jQuery
// Use jQuery.cookie if you want to restore the previous expansion of the tree

!function($) {

  $.fn.tree = function(options) {

    // Setup default options
    /* Avaiable options are:
     *  - open_char: defeault UTF8 character on open node.
     *  - close_char: defeault UTF8 character on close node.
     *  - default_expanded_paths_string: if no cookie found the tree will be expanded with this paths string (default '')
     *      To expand all children use 'all'.
     *      To close all the tree use ''.
     *      To expand the first child and the second child of the first child use '0/1'
     *  - only_one: if this option is true only one child will be expanded at time (default false)
     *  - animation: animation used to expand a child (default 'slow')
     */

    if(!options) options = {};
    var default_options = {
      open_char                     : '&#9660;',
      close_char                    : '&#9658;',
      default_expanded_paths_string : '',
      only_one                      : false,
      animation                     : 'slow'
    };
    var o = {};
    $.extend(o, default_options, options);

    // Get the expanded paths from the current state of tree
    $.fn.save_paths = function() {
      var paths = [],
          path = [],
          open_nodes = $(this).find('li span.open'),
          last_depth = null;
      for(var i = 0; i < open_nodes.length; i++) {
        var depth = $(open_nodes[i]).parents('ul').length-1;
        if((last_depth == null && depth > 0) || (depth > last_depth && depth-last_depth > 1))
          continue;
        var pos = $(open_nodes[i]).parent().prevAll().length;
        if(last_depth == null) {
          path = [pos];
        } else if(depth < last_depth) {
          paths.push(path.join('/'));
          var diff = last_depth - depth;
          path.splice(path.length-diff-1, diff+1);
          path.push(pos);
        } else if(depth == last_depth) {
          paths.push(path.join('/'));
          path.splice(path.length-1, 1);
          path.push(pos);
        } else if(depth > last_depth) {
          path.push(pos);
        }
        last_depth = depth;
      }
      paths.push(path.join('/'));
      // Save state to cookie
      var cookie_key = this.data('cookie');
      if(!cookie_key) cookie_key = 'jtree-cookie';
      try { $.cookie(cookie_key, paths.join(',')); }
      catch(e) {}
    };

    // This function expand the tree with 'path'
    $.fn.restore_paths = function() {
      var paths_string = null;
      var cookie_key = this.data('cookie');
      if(!cookie_key) cookie_key = 'jtree-cookie';
      try { paths_string = $.cookie(cookie_key); }
      catch(e) {}
      if(!paths_string) paths_string = o.default_expanded_paths_string;
      if(paths_string == 'all') {
        $(this).find('span.jtree-arrow').open();
      } else {
        var paths = paths_string.split(',');
        for(var i = 0; i < paths.length; i++) {
          var path = paths[i].split('/'),
              obj = $(this);
          for(var j = 0; j < path.length; j++) {
            obj = $(obj.children('li')[path[j]]);
            obj.children('span.jtree-arrow').open();
            obj = obj.children('ul')
          }
        }
      }
    };

    // Expand the tree (animation bug fixed - @stecb)
    $.fn.expand = function(animation) {
      animation = (animation == 'none') ? undefined : (!animation) ? o.animation : animation;
      // find each :first-child .jtree-arrow.close element (we don't need to care about open elements, they're already open...)
      elems = $(this).find('.jtree-arrow.close:first-child');
      // their childs .jtree-arrow.close need to be opened without animation (!IMPORTANT!)
      elems.siblings('ul').find('.jtree-arrow.close').open(undefined);
      // the :first-child elements now can be opened with animation (height is known now)
      elems.open(animation);
    };

    // Collapse the tree
    $.fn.collapse = function(animation) {
      animation = (animation == 'none') ? undefined : (!animation) ? o.animation : animation;
      $(this).find('.jtree-arrow').close(animation);
    };

    // Open a child
    $.fn.open = function(animation) {
      if($(this).hasClass('jtree-arrow')) {
        $(this).parent().children('ul').show(animation);
        $(this).removeClass('close').addClass('open').html(o.open_char);
      }
    };

    // Close a child
    $.fn.close = function(animation) {
      if($(this).hasClass('jtree-arrow')) {
        $(this).parent().children('ul').hide(animation);
        $(this).removeClass('open').addClass('close').html(o.close_char);
      }
    };

    // Click event on <span class="jtree-arrow"></span>
    $.fn.click_event = function() {
      var button = $(this);
      if(button.hasClass('jtree-arrow')) {
        button[button.hasClass('open') ? 'close' : 'open'](o.animation);
        if(o.only_one) button.closest('li').siblings().children('span.jtree-arrow').close(o.animation);
      }
    };

    for(var i = 0; i < this.length; i++) {
      if(this[i].tagName === 'UL') {
        // Make a tree
        $(this[i]).find('li').has('ul').prepend('<span class="jtree-arrow close" style="cursor:pointer;">' + o.close_char + '</span>');
        $(this[i]).find('ul').hide();
        // Restore cookie expand path
        $(this[i]).restore_paths();
        // Click event for arrow
        $(this[i]).find('li > span.jtree-arrow').on('click', {tree : this[i]}, function(e) {
          $(this).click_event();
          $(e.data.tree).save_paths();
        });
        // Click event for 'jtree-button'
        $(this[i]).find('li .jtree-button').on('click', {tree : this[i]}, function(e) {
          var arrow = $(this).closest('li').children('span.jtree-arrow');
          arrow.click_event();
          $(e.data.tree).save_paths();
        });
      }
    }
  };

}(jQuery);
