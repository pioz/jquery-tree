// Require jQuery
// Use jQuery.cookie if you want to restore the previous expansion of the tree

jQuery.fn.tree = function(options) {

  if(this[0].tagName === 'UL') { // Ok, this object is a unorder list
    // Setup default options
    /** Avaiable options are:
     *  - open_char: defeault character to display on open node in tree
     *  - close_char: defeault character to display on close node in tree
     *  - default_expanded_paths_string: if no cookie found the tree will be expand with this paths string
    **/
    if(options === undefined || options === null)
      options = {};
    var open_char = options.open_char;
    var close_char = options.close_char;
    var default_expanded_paths_string = options.default_expanded_paths_string;
    if(open_char === undefined || open_char === null)
      open_char = '&#9660;';
    if(close_char === undefined || close_char === null)
      close_char = '&#9658;';
    if(default_expanded_paths_string === undefined || default_expanded_paths_string === null)
      default_expanded_paths_string = '0';

    // Save this
    var tree = jQuery(this);

    // Get the expanded paths from the current state of tree
    jQuery.fn.get_paths = function() {
      var paths = [];
      var path = [];
      var open_nodes = jQuery(this).find('li span.open');
      var last_depth = null;
      for(var i = 0; i < open_nodes.length; i++) {
        var depth = jQuery(open_nodes[i]).parents('ul').length-1;
        if((last_depth == null && depth > 0) || (depth > last_depth && depth-last_depth > 1))
          continue;
        var pos = jQuery(open_nodes[i]).parent().prevAll().length;
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
      return paths.join(',');
    };

    // This function expand the tree with 'path'
    jQuery.fn.tree_open = function(paths_string) {
      if(paths_string === null || paths_string === undefined)
        paths_string = default_expanded_paths_string;
      var paths = paths_string.split(',');
      for(var i = 0; i < paths.length; i++) {
        var obj = jQuery(this);
        var path = paths[i].split('/');
        for(var j = 0; j < path.length; j++) {
          obj = jQuery(obj.children('li').children('ul')[path[j]]);
          obj.show();
          obj.parent().children('span').attr('class', 'open');
          obj.parent().children('span').html(open_char);
        }
      }
    };

    // Make a tree
    jQuery(this).find('li').has('ul').prepend('<span class="close" style="cursor:pointer;">' + close_char + '</span>');
    jQuery(this).find('ul').hide();
    // Restore cookie expand path
    try { tree.tree_open(jQuery.cookie(tree.attr('class'))); }
    catch(e) { tree.tree_open(default_open_path); }
    // Click event
    jQuery(this).find('span').live('click', function() {
      if (jQuery(this).attr('class') == 'open') {
        jQuery(this).parent().children('ul').hide('slow');
        jQuery(this).attr('class', 'close');
        jQuery(this).html(close_char);
      } else if (jQuery(this).attr('class') == 'close') {
        jQuery(this).parent().children('ul').show('slow');
        jQuery(this).attr('class', 'open');
        jQuery(this).html(open_char);
      }
      jQuery.cookie(tree.attr('class'), tree.get_paths());
    });
  }
}
