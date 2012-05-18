jQuery-tree
===========

jQuery-tree is a jQuery plugin to make an HTML unorder list (`<ul>`) in a tree.

The state of the tree expansion will be saved in a cookie. To enable this
feature include the jQuery cookie plugin (http://plugins.jquery.com/project/Cookie).

-------------------------------------------------------------------------------

See the example at http://pioz.github.com/jquery-tree/index.html

-------------------------------------------------------------------------------

USAGE:

You can make an UL in a tree with: `$('ul').tree();`

Avaiable options are:
  *  open_char: defeault UTF8 character on open node.
  *  close_char: defeault UTF8 character on close node.
  *  default_expanded_paths_string: if no cookie found the tree will be expanded with this paths string (default '')
       To expand all branches use 'all'.
       To collapse all branches use ''.
       To expand the first child and the second child of the first child use '0/1'
  *  only_one: if this option is true only one child will be expanded at time (default false)
  *  animation: animation used to expand a child (default 'slow')

You can bind a click event to expand/collapse a branch by adding the class
'jtree-button' on a tag inside the branch.

You can call the method 'expand(animation)' or 'collapse(animation)' to expand or collapse the tree.
Animation can be null to use default animation, 'none' to not use animation.

To save the state of the tree expansion when there are many trees in the same
page, you have to specify a cookie key different for every tree. To do this
add the data attribute `data-cookie="unique-key"` to UL tag.

-------------------------------------------------------------------------------

Questions or problems?
If you have any issues please add an issue on GitHub or fork the project and
send a pull request.

-------------------------------------------------------------------------------

Copyright © 2012 [Enrico Pilotto (@pioz)](http://github.com/pioz).

Contributors:
  - [Stefano Ceschi Berrini (@stecb)](http://github.com/stecb)
