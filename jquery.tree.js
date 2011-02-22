// Require jQuery
// Use jQuery.cookie if you want restore the previously expand path tree state

jQuery.fn.tree = function(options) {

  if(this[0].tagName === 'UL') { // Ok, this object is a unorder list
    // Setup default options
    /** Avaiable options are:
     *  - open_char: defeault character to display on open node in tree
     *  - close_char: defeault character to display on close node in tree
     *  - default_open_path: if no cookie found the tree will be expand with this path
    **/
    if(options === undefined || options === null)
      options = {};
    var open_char = options.open_char;
    var close_char = options.close_char;
    var default_open_path = options.default_open_path;
    if(open_char === undefined || open_char === null)
      open_char = '&#9660;';
    if(close_char === undefined || close_char === null)
      close_char = '&#9658;';
    if(default_open_path === undefined || default_open_path === null)
      default_open_path = '0';

    // Save this
    var tree = jQuery(this);

    // This function get the current expand path of tree
    jQuery.fn.tree_path = function() {
      var path = [];
      var open_node = jQuery(this).find('li span.open');
      for(var i = 0; i < open_node.length; i++) {
        path.push(jQuery(open_node[i]).parent().prevAll().length);
      }
      return path.join('/');
    };

    // This function expand the tree with 'path'
    jQuery.fn.tree_open = function(path) {
      if(path === null || path === undefined)
        path = default_open_path;
      var c = path.split('/');
      var obj = jQuery(this);
      for(var i = 0; i < c.length; i++) {
        obj = jQuery(obj.children('li').children('ul')[c[i]]);
        obj.show();
        obj.parent().children('span').attr('class', 'open');
        obj.parent().children('span').html(open_char);
      }
    };

    // Make a tree
    jQuery(this).find('li').has('ul').prepend('<span class="close">' + close_char + '</span>');
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
      try { jQuery.cookie(tree.attr('class'), tree.tree_path()); }
      catch(e) {}
    });
  }
}
